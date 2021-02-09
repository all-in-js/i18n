const xlsx = require('node-xlsx').default;
const { fse, fetch, resolvePkg, joinCWD, spinner, log } = require('@iuv-tools/utils');
const { catchFetchErr } = require('./util');
const namesMap = require('./names-map');

const pkg = resolvePkg();
const filename = lang => `待翻译词条.${pkg.name}.${lang}`;

function createExcel(filepath, datas) {
  try {
    const buffer = xlsx.build(datas);
    fse.writeFileSync(filepath, buffer);
  } catch (e) {
    spinner.stop();
    log.error(e.message);
    process.exit(1);
  }
}
// untrans-messages
async function getUntransMessages(lang, host) {
  try {
    const res = await fetch(host + '/i18n/proj/untrans-messages', {
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

async function exportMessages(lang, host, fileType) {
  spinner.step('fetching untranslated messages...');
  const untransMess = await getUntransMessages(lang, host);
  if (fileType === 'json') {
    exportJson(lang, untransMess);
  } else {
    exportExcel(lang, untransMess);
  }
  spinner.stop();
  log.done('exported untranslated messages.');
}

function exportJson(lang, values) {
  const json = values.reduce((obj, item) => {
    return Object.assign(obj, {
      [item.key]: item.value
    });
  }, {});
  fse.writeJsonSync(`${filename(lang)}.json`, json, {
    spaces: 2
  });
}

function exportExcel(langs = '', messages) {
  const datas = langs.split(',').reduce((data, lang) => {
    data[lang] = {
      name: `【${lang}】待翻译词条`,
      data: [['中文(zh-CN)', `${namesMap[lang]}(${lang})`]]
    }
    return data;
  }, {});
  for (const item of messages) {
    datas[item.lang].data.push([
      item.key
    ]);
  }
  createExcel(joinCWD(`${filename(langs.split('.'))}.xlsx`), Object.values(datas));
}

module.exports = exportMessages;