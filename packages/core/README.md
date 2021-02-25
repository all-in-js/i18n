## @all-in-js/i18n-core

> 框架无关的国际化处理方案

### Install

```bash
npm i @all-in-js/i18n-core
// or
yarn add @all-in-js/i18n-core
```

### Usage

```js
import I18n from '@all-in-js/i18n-core';

const i18n = new I18n(option);
// do sth...
```

### Option

* **option.locale**

  语言类型，默认为 `zh-CN`

* **option.messages**

  所有支持语言的词条集合，如：

  ```js
  {
    'zh-CN': {
      [key]: 'value'
    },
    'en-US': {
      [key]: 'value'
    }
  }
  ```

* **option.numberFormats**

  数字本地化，根据不同地区显示不同的数字格式，参数选项参考：[ECMA-402 Intl.NumberFormat option](http://www.ecma-international.org/ecma-402/2.0/#sec-properties-of-intl-numberformat-instances)

  ```js
  const numberFormats = {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
  ```

* **option.dateTimeFormats**

  日期时间本地化，根据不同地区显示不同的日期时间格式，参数选项参考：[ECMA-402 Intel.DateTimeFormat option](http://www.ecma-international.org/ecma-402/2.0/#sec-InitializeDateTimeFormat)

  ```js
  const dateTimeFormats = {
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
  ```

* **option.pathGap**

  读取词条时的路径分隔符，默认为 `.`

### API

* **t: (path, param) => string**

  词条翻译函数，`path` 参数支持字符串模板，`param` 为模板的参数，支持对象、数组、函数；

  ```js
  const i18n = new I18n({
    messages: {
      'zh-CN': {
        greet: {
          say: 'hello, {name}!'
        }
      }
    }
  });

  const val = i18n.t('greet.say', {name: 'bob'});

  // val: hello, bob!
  ```

* **n: (value, optionAlias, locale?) => FormatNumber**

  数字本地化函数

  ```js
  const numberFormats = {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
  const i18n = new I18n({
    numberFormats
  });
  const val = i18n.n(10, 'currency');
  // val: $10.00
  ```

* **d: (value, optionAlias, locale?) => DateTimeFormat**

  日期时间本地化

  ```js
  const dateTimeFormats = {
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
  const i18n = new I18n({
    dateTimeFormats
  });
  const val = i18n.d(new Date(), 'short');
  // val: Apr 26, 2020
  ```

* **set/get locale**

  设置或取得语言类型，设置时会触发当前语言词条的切换

* **setLocale: (locale, message?) => void**

  设置语言和对应的词条，`message` 不传则仅切换语言环境；

* **mergeLocaleMessage: (locale, message) => void**

  合并词条

* **mergeOptions: options => void**

  合并locale, messages, numberFormats, dateTimeFormats等选项；

* **setNumberFormats: (locale, formats) => void | set numberFormats**

  设置语言类型的 `numberFormats`，当通过 `i18n.numberFormats = numberFormats` 设置时，`locale` 为当前语言类型

* **mergeNumberFormats: (locale, formats) => void**

  合并某个语言的数字本地化设置


* **setDateTimeFormats: (locale, formats) => void | set dateTimeFormats**

  设置语言类型的 `dateTimeFormats`，当通过 `i18n.dateTimeFormats = dateTimeFormats` 设置时，`locale` 为当前语言类型

* **mergeDateTimeFormats: (locale, formats) => void**

  合并某个语言的日期 时间本地化设置