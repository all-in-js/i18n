#!/usr/bin/env node

const I18n = require('../lib');
const {
  _: commands,
  ...argv
} = require('yargs-parser')(
  process.argv.slice(2),
  {
    alias: {
      dir: 'd',
      lang: 'l',
      file: 'f',
      host: 'h',
      ignoredir: 'i', // 需要忽略的文件夹或者文件名称，用","链接
    }
  }
);

const command = commands[0];

if (!command || command === 'push') {
  new I18n(argv).push();
} else if (command === 'pull') {
  new I18n(argv).pull();
} else if (command === 'export') {
  new I18n(argv).export();
} else if (command === 'import') {
  const cmdFile = commands[1];
  if (cmdFile) {
    argv.file = cmdFile;
  }
  new I18n(argv).import();
} else if (command === 'collect') {
  new I18n(argv).collect();
  // collect
} else {
  // help
}

