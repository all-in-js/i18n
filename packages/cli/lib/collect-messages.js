const glob = require('fast-glob');
const { resolve, cwd, astCtrl, fse, log, spinner, color } = require('@all-in-js/utils');
const { findMessagesVisitorCreater } = require('./util');
const writeLangMessages = require('./write-messages');

/**
 * 收集每个语言的messages
 * @param {string} lang 语言类型，多个逗号隔开，如：zh-CN,en-US
 * @param {string} commonPath 语言包文件所在的相对路径
 */
function langMessages(lang, commonPath) {
  const messages = {};
  if (lang) {
    const langs = lang.split(',');
    langs.forEach(lang => {
      const filepath = resolve(cwd, commonPath, `${lang}.js`);
      const zhCN = resolve(cwd, commonPath, `zh-CN.js`);
      const { extra } = astCtrl(zhCN, findMessagesVisitorCreater, 2);
      if (!fse.existsSync(filepath)) {
        // 如果不存在某个语言文件，从zh-CN.js中提取messages，生成新的语言文件
        fse.writeFileSync(filepath, langFileTemplate(lang));
        writeLangMessages(filepath, extra.message);
      } else {
        // 如果某个语言文件已经存在，和zh-CN.js中的messages进行比对，确保一致
        const { extra: langExtra } = astCtrl(filepath, findMessagesVisitorCreater);
        const {
          newMessages,
          same
        } = keepSameWithZhcnMessages(langExtra.message, extra.message);
        if (!same) {
          writeLangMessages(filepath, newMessages);
        }
      }

      const { extra: fileExtra } = astCtrl(filepath, findMessagesVisitorCreater);
      messages[lang] = fileExtra.message;
    });
  }
  return messages;
}

/**
 * 保持语言包和zh-CN.js里的messages一致
 * @param {object} messages 语言包的词条
 * @param {object} zhcn zh-CN.js中的词条
 */
function keepSameWithZhcnMessages(messages, zhcn) {
  const newMessages = {};
  let same = true;
  if (messages && zhcn) {
    for (const item in zhcn) {
      let value = messages[item];
      if (!value) {
        value = zhcn[item];
        same = false;
      }
      newMessages[item] = value;
    }
  }
  return {
    newMessages,
    same
  };
}

/**
 * 聚合所有传入的语言的messages
 * @param {string} dir 从哪个目录开始查找语言文件
 * @param {string} lang 语言类型，多个逗号隔开
 * @returns {object} ModulesMessages
 * ModulesMessages: {
 *    [commonPath]: {
 *        [lang]: {
 *            key: value
 *        }
 *    }
 * }
 */
function collectMessages(dir, lang) {
  spinner.clear();
  log.info(`entry directory: ${ color.green(dir) }`);
  log.info(`languages：${ color.green(lang) }`);
  const files = findZhcnFiles(dir);
  const ModulesMessages = {};
  if (files.length) {
    files.forEach(file => {
      const commonPath = file.replace(/\/[^\/]+$/, '');
      const messages = langMessages(`zh-CN,${ lang }`, commonPath);
      ModulesMessages[commonPath] = messages;
    });
  }
  
  return ModulesMessages;
}

/**
 * 语言文件模板
 * @param {string} lang 
 * @param {string} messages 
 */
function langFileTemplate(lang) {
  return `export default {
  lang: '${lang}',
  messages: {}
};

`;
}

/**
 * 在目标目录里查找所有的zh-CN.js
 * @param {string} dirs 目标目录
 */
function findZhcnFiles(dirs = '') {
  const targets = dirs.split(',').map(dir => `${dir}/**/zh-CN.js`);
  const files = glob.sync(targets);
  return files;
}

module.exports = collectMessages;
