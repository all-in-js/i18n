const { fetch, fse, log, resolvePkg, resolveCWD, spinner } = require('@iuv-tools/utils');
const { catchFetchErr } = require('./util');
const pull = require('./pull');

const { name } = resolvePkg();
/**
 * 1. 解析excel或json，将翻译后的词条传到服务端，服务端更新数据
 * 2. 执行pull更新到本地
 */
async function importMessages(fileName, dir, host) {
  const file = resolveCWD(fileName);
  if (!fse.existsSync(file)) {
    log.error(`'${fileName}' does not exists.`);
    process.exit(1);
  }
  const parsedFileName = parseFileName(fileName);
  if (!parsedFileName) {
    log.error(`'${fileName}', the '{xxx}.{lang}.{ext}' pattern excepted for the fileName.`);
    process.exit(1);
  }
  const [lang, fileType] = parsedFileName;
  spinner.step(`uploading: ${fileName}`);
  try {
    const res = await fetch(`${host}/i18n/proj/client-upload?byName=${name}&lang=${lang}&fileType=${fileType}`, {
      method: 'POST',
      body: fse.createReadStream(file)
    });
    const {
      success,
      result
    } = await res.json();

    if (success) {
      await pull(dir, lang, host);
    } else {
      catchFetchErr(result.message);
    }
  } catch (e) {
    catchFetchErr(e.message);
  }
}

function parseFileName(fileName) {
  const matched = fileName.match(/\.([a-zA-Z\-]+)\.(\w+)$/);
  return matched ? matched.slice(1, 3) : null;
}

module.exports = importMessages;