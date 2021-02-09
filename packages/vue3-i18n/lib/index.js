const { reactive } = require('vue');
const I18nCore = require('@open-fe/i18n-core');

const I18nCorePlugin = {
  install(app, option) {
    if (install.installed) return;
    install.installed = true;

    const i18n = new I18nCore(option);
    const state = reactive(i18n);
    
    app.config.globalProperties.$i18n = state;

    ;['t', 'd', 'n'].forEach((method) => {
      app.config.globalProperties[`$${method}`] = state[method].bind(state);
    });
  }
}

module.exports = I18nCorePlugin;