const push = require('./push');
const pull = require('./pull');
const collect = require('./get-lang');
const exportMessages = require('./export');
const importMessages = require('./import');

module.exports = class I18n {
  constructor({
    dir = 'src/modules,src/components',
    ignoredir = '',
    lang = 'en-US',
    host = 'http://localhost:3100',
    json = false,
    excel = false,
    file
  } = {}) {
    this.dir = dir.endsWith('/') ? dir.slice(0, -1) : dir;
    this.ignoredir = ignoredir.split(',');
    this.lang = lang;
    this.host = host;
    this.json = json;
    this.excel = excel;
    this.file = file;
  }
  async push() {
    await push(this.dir, this.lang, this.host);
  }
  async pull() {
    await pull(this.dir, this.lang, this.host);
  }
  async export() {
    let fileType = 'excel';
    if (this.json) {
      fileType = 'json';
    }
    await exportMessages(this.lang, this.host, fileType);
  }
  async import() {
    await importMessages(this.file, this.dir, this.host);
  }
  async collect() {
    await collect.getLang(this.dir, this.ignoredir);
  }
}

