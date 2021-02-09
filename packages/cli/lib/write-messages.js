const { fse, astCtrl } = require('@iuv-tools/utils');
const single = require('to-single-quotes');

function createMessagesObjectExpression(t, messages = {}) {
  const keys = Object.keys(messages);
  return keys.length ?
        keys.map(key => {
          return t.objectProperty(
                  t.stringLiteral(key),
                  t.stringLiteral(messages[key] || '')
                );
        }) :
        [];
}

function createVisitor(messages) {
  return babel => {
    const { types: t } = babel;
    return {
      ObjectProperty(p) {
        const { key, value } = p.node;
        // 替换messages
        if (key.name === 'messages' && t.isObjectExpression(value)) {
          p.node.value = t.objectExpression(createMessagesObjectExpression(t, messages));
        }
      }
    }
  }
}

function writeMessages(filepath, messages) {
  const { code } = astCtrl(filepath, createVisitor(messages));
  fse.writeFileSync(filepath, single(code) + '\n');
}

module.exports = writeMessages;