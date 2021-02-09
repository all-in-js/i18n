const pretty = require('pretty-js');
const { spinner, log } = require('@iuv-tools/utils');

function fmtJson(code, option) {
  return pretty(code, {
    ...{
      indent: '  ',
      convertStrings: 'single'
    },
    ...option
  });
};

/**
 * 收集messages到extra
 */
function findMessagesVisitorCreater(babel, extra) {
  const { types: t } = babel;
  return {
    ObjectProperty(p) {
      const { key, value } = p.node;
      if ((key.name || key.value) === 'messages' && t.isObjectExpression(value)) {
        const { properties } = value;
        const message = {};
        if (properties.length) {
          properties.forEach(({key, value}) => {
            message[key.name || key.value] = value.value; 
          });
        }
        
        extra.message = message;
      }
    }
  }
}

function catchFetchErr(msg) {
  spinner.stop();
  log.error(msg, 'fetch');
  process.exit(1);
}

module.exports = {
  catchFetchErr,
  fmtJson,
  findMessagesVisitorCreater
}