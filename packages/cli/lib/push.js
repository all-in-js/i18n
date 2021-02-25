const { log, fetch, resolvePkg, joinCWD, spinner } = require('@all-in-js/utils');
const collectMessages = require('./collect-messages');
const writeMessages = require('./write-messages');
const { catchFetchErr } = require('./util');

const { name, author: maintainer } = resolvePkg();
const changed = [];

async function push(dir, lang, host) {
  spinner.step('syncing messages...');
  const messages = collectMessages(dir, lang);
  try {
    let res = await fetch(host + '/i18n/proj/sync-messages', {
      method: 'post',
      body: JSON.stringify({
        name,
        maintainer,
        messages
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res = await res.json();
    handleResMessages(messages, res);
    if (changed.length) {
      printResult(changed);
    }
  } catch (e) {
    catchFetchErr(e.message);
  }

}

function handleResMessages(messages, {
  success,
  result
} = {}) {
  spinner.stop();
  if (success) {
    const pathes = Object.keys(result);
    for (const commonPath of pathes) {
      const langMess = result[commonPath];
      const langs = Object.keys(langMess);
      for (const lang of langs) {
        if (lang !== 'zh-CN') {
          const resLangMess = JSON.stringify(langMess[lang]);
          const oriLangMess = JSON.stringify(messages[commonPath][lang]);
          if (resLangMess !== oriLangMess) {
            // 翻译后
            const filepath = joinCWD(commonPath, `${lang}.js`);
            changed.push(filepath);
            // resLangMess && fse.writeFileSync(filepath, fmtJson(messTemp(resLangMess), {
            //   indent: '  ',
            //   convertStrings: 'single'
            // }));
            if (resLangMess) {
              writeMessages(filepath, langMess[lang]);
            }
          }
        }
      }
    }
    log.done('all messages has been sent to server.');
  } else {
    catchFetchErr(result.message);
  }
}

function messTemp(lang, messages) {
  return `
export default {
  lang: ${lang},
  messages: ${messages}
};

`;
}

function printResult(res) {
  if (res.length) {
    log.info('changed files: ');
    res.forEach(item => console.log(`  ${item}`));
  }
}

module.exports = push;
