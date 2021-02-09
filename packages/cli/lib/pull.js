const { fetch, resolvePkg, spinner, joinCWD, log } = require('@iuv-tools/utils');
const collectMessages = require('./collect-messages');
const writeMessages = require('./write-messages');
const { catchFetchErr } = require('./util');

const pkg = resolvePkg();
/**
 * 1. collect messages
 * 2. 拉取项目下所有的词条
 * 3. 逐个词条比对
 */
async function getLangMessages(lang, host) {
  try {
    const res = await fetch(host + '/i18n/proj/lang-messages', {
      method: 'post',
      body: JSON.stringify({
        name: pkg.name,
        lang
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const { success, result } = await res.json();
    if (success) {
      return result;
    }
    catchFetchErr(result.message);
  } catch (e) {
    catchFetchErr(e.message);
  }
}

async function pull(dir, lang, host) {
  spinner.step('fetching messages...');
  // ModulesMessages: {
  //   *    [commonPath]: {
  //   *        [lang]: {
  //   *            key: value
  //   *        }
  //   *    }
  //   * }
  const messages = collectMessages(dir, lang);
  const res = await getLangMessages(lang, host);
  const pathes = Object.keys(messages);

  if (!pathes.length) {
    spinner.done(`the zh-CN.js is not provided, please use 'i18n collect' before pull.`);
    process.exit(1);
  }
  if (!res.length) {
    spinner.done(`no data, please use 'i18n push' before pull.`);
    process.exit(1);
  }

  const newMessages = combineMessages(res);
  const changedFiles = {};
  for (const commonPath of pathes) {
    const moduleLangs = messages[commonPath];
    const langs = Object.keys(moduleLangs);
    for (const lang of langs) {
      if (lang !== 'zh-CN') {
        // 暂不可修改zh-CN.js，会导致collect命令无法识别
        const langMess = moduleLangs[lang];
        const newLangMess = newMessages[lang];
        const filepath = joinCWD(commonPath, `${lang}.js`);
        for (const item in langMess) {
          if (langMess[item] !== newLangMess[item]) {
            changedFiles[filepath] = true;
            langMess[item] = newLangMess[item];
          }
        }
        if (changedFiles[filepath]) {
          changedFiles[filepath] = langMess;
        }
      }
    }
  }

  updateChangedFiles(changedFiles);
}

function updateChangedFiles(changed) {
  const files = Object.keys(changed);
  if (files.length) {
    files.forEach(file => {
      writeMessages(file, changed[file]);
    });
    spinner.stop();
    log.info('some files changed:');
    console.log(files);
  } else {
    spinner.stop();
    log.info('no new datas.');
  }
}

function combineMessages(res = []) {
  const messages = {};
  res.forEach(item => {
    if (messages[item.lang]) {
      messages[item.lang][item.key] = item.value;
    } else {
      messages[item.lang] = {
        [item.key]: item.value
      };
    }
  });
  return messages;
}

module.exports = pull;