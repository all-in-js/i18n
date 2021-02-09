const { getArgType, log, template, createRTLStyle } = require('./util'); 
const clonedeep = require('lodash.clonedeep');
const merge = require('lodash.merge');

const { name: pkgName } = require('../package.json');
const tagInfo = info => `${pkgName}: ${info}`;

// 私有元数据，防止直接通过实例修改
const messagesMetaData = {};
const numberFormatsMetaData = {};
const dateTimeFormatsMetaData = {};

function initMessagesMetaData(messages) {
  Object.keys(messages).forEach(lang => {
    const message = messages[lang];
    if (getArgType(message).isObject) {
      messagesMetaData[lang] = clonedeep(message);
    } else {
      log.warn(`skiped. have an invalid message of '${lang}'`, tagInfo('initMessagesMetaData'));
    }
  });
}

function initNumberFormatsMetaData(formats) {
  Object.keys(formats).forEach(lang => {
    const formatter = formats[lang];
    if (getArgType(formatter).isObject) {
      numberFormatsMetaData[lang] = clonedeep(formatter);
    } else {
      log.warn(`skiped. have an invalid formatter of '${lang}'`, tagInfo('initNumberFormatsMetaData'));
    }
  });
}

function initDateTimeFormatsMetaData(formats) {
  Object.keys(formats).forEach(lang => {
    const formatter = formats[lang];
    if (getArgType(formatter).isObject) {
      dateTimeFormatsMetaData[lang] = clonedeep(formatter);
    } else {
      log.warn(`skiped. have an invalid formatter of '${lang}'`, tagInfo('initDateTimeFormatsMetaData'));
    }
  });
}

function checkFormats(formats = {}) {
  const keys = Object.keys(formats);
  const invalidItem = item => getArgType(item).isObject;
  const invalidFormats = keys.every(key => invalidItem(formats[key]));
  return invalidFormats;
}

class I18n {
  constructor({
    pathGap = '.',
    locale = 'zh-CN',
    messages = {},
    numberFormats,
    dateTimeFormats,
    direction = 'LTR',
    verbose = true
  } = {}) {
    log.verbose = verbose;

    this.pathGap = pathGap;
    this.direction = direction;
    this._locale = locale;

    if (getArgType(messages).isObject) {
      initMessagesMetaData(messages)
    } else {
      return log.error('invalid messages, please have a check.', tagInfo('constructor'));
    }

    if (numberFormats) {
      if (!getArgType(numberFormats).isObject) {
        return log.error('invalid numberFormats, please have a check.', tagInfo('constructor'));
      } else {
        const invalidFormats = checkFormats(numberFormats);
        if (!invalidFormats) {
          return log.error('invalid item of numberFormats, please have a check.', tagInfo('constructor'));
        }
      }
      initNumberFormatsMetaData(numberFormats);
    }

    if (dateTimeFormats) {
      if (!getArgType(dateTimeFormats).isObject) {
        return log.error('invalid dateTimeFormats, please have a check.', tagInfo('constructor'));
      } else {
        const invalidFormats = checkFormats(dateTimeFormats);
        if (!invalidFormats) {
          return log.error('invalid item of dateTimeFormats, please have a check.', tagInfo('constructor'));
        }
      }
      initDateTimeFormatsMetaData(dateTimeFormats);
    }

    this.message = messagesMetaData[locale];
  }
  setDirection(direction) {
    direction = direction.toString().toLowerCase();
    this._direction = direction;
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-direction', direction);
    if (htmlElement && direction === 'rtl') {
      htmlElement.classList.add(direction);
      createRTLStyle();
    }
  }
  set direction(direction) {
    this.setDirection(direction);
  }
  get direction() {
    return this._direction;
  }
  set locale(value) {
    this._locale = value;
    this.message = messagesMetaData[value];
  }
  get locale() {
    return this._locale;
  }
  setLocale(locale, message) {
    if (!message && getArgType(locale).isObject) {
      message = locale;
      locale = this.locale;
    }
    if (!message && messagesMetaData[locale]) {
      message = messagesMetaData[locale];
    }
    if (!getArgType(message).isObject) {
      return log.warn('this is an invalid message.', tagInfo('setLocale'));
    }
    messagesMetaData[locale] = message;

    this.locale = locale;
  }
  mergeLocaleMessage(locale, newMessage) {
    if (!newMessage && getArgType(locale).isObject) {
      newMessage = locale;
      locale = this.locale;
    }
    if (!getArgType(newMessage).isObject) {
      return log.warn('this is an invalid message.', tagInfo('mergeLocaleMessage'));
    }
    const message = messagesMetaData[locale] || {};
    const mergedMessages = merge(message, newMessage);
    messagesMetaData[locale] = mergedMessages;
    this.locale = locale;
  }
  set numberFormats(formats) {
    this.setNumberFormats(this.locale, formats);
  }
  setNumberFormats(locale, formats) {
    if (!formats && getArgType(locale).isObject) {
      formats = locale;
      locale = this.locale;
    }
    if (!getArgType(formats).isObject) {
      return log.error('invalid formats, expect an Object.', tagInfo('setNumberFormats'));
    }
    numberFormatsMetaData[locale] = formats;
  }
  mergeNumberFormats(locale, formats) {
    if (!formats && getArgType(locale).isObject) {
      formats = locale;
      locale = this.locale;
    }
    if (!getArgType(formats).isObject) {
      return log.error('invalid formats, expect an Object.', tagInfo('mergeNumberFormats'));
    }
    const localeFormats = numberFormatsMetaData[locale];
    const mergedFormats = merge(localeFormats, formats);
    numberFormatsMetaData[locale] = mergedFormats;
  }
  set dateTimeFormats(formats) {
    this.setDateTimeFormats(this.locale, formats);
  }
  setDateTimeFormats(locale, formats) {
    if (!formats && getArgType(locale).isObject) {
      formats = locale;
      locale = this.locale;
    }
    if (!getArgType(formats).isObject) {
      return log.error('invalid formats, expect an Object.', tagInfo('setDateTimeFormats'));
    }
    dateTimeFormatsMetaData[locale] = formats;
  }
  mergeDateTimeFormats(locale, formats) {
    if (!formats && getArgType(locale).isObject) {
      formats = locale;
      locale = this.locale;
    }
    if (!getArgType(formats).isObject) {
      return log.error('invalid formats, expect an Object.', tagInfo('mergeDateTimeFormats'));
    }
    const localeFormats = dateTimeFormatsMetaData[locale];
    const mergedFormats = merge(localeFormats, formats);
    dateTimeFormatsMetaData[locale] = mergedFormats;
  }
  mergeOptions({
    locale,
    messages,
    numberFormats,
    dateTimeFormats
  } = {}) {
    if (!locale) {
      locale = this.locale;
    }
    this.mergeLocaleMessage(locale, messages);
    this.mergeNumberFormats(locale, numberFormats);
    this.mergeDateTimeFormats(locale, dateTimeFormats);
  }
  t(path, param) {
    let message = this.message;
    let result = '';
    if (message && Object.keys(message).length) {
      const keys = path.toString().split(this.pathGap);
      for (const key of keys) {
        message = message[key];
        if (message !== undefined) {
          result = message;
        } else {
          result = path;
          log.warn(`Cannot translate the value of keypath '${path}'. Use the value of keypath as default.`, tagInfo('t'));
          break;
        }
      }
    }

    if (result) {
      result = template(result, param);
    }

    return result;
  }
  n(value, optionAlias, locale) {
    if (!locale) {
      locale = this.locale;
    }
    let option;
    const localeFormats = numberFormatsMetaData[locale];
    if (localeFormats && optionAlias) {
      option = localeFormats[optionAlias];
    }
    return new Intl.NumberFormat(locale, option).format(value);
  }
  d(value, optionAlias, locale) {
    if (!locale) {
      locale = this.locale;
    }
    let option;
    const localeFormats = dateTimeFormatsMetaData[locale];
    if (localeFormats && optionAlias) {
      option = localeFormats[optionAlias];
    }
    return new Intl.DateTimeFormat(locale, option).format(value);
  }
}

module.exports = I18n;