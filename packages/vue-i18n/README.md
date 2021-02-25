## @all-in-js/vue-i18n

> 基于 `@all-in-js/i18n-core` 和 `Vue` 的国际化处理方案

### Install

```bash
npm i @all-in-js/vue-i18n
// or
yarn add @all-in-js/vue-i18n
```

### Usage

main.js
```js
import Vue from 'vue';
import VueI18n from '@all-in-js/vue-i18n';

Vue.use(VueI18n, {
  locale: 'zh-CN',
  messages: {
    'zh-CN': {}
  },
  numberFormats: {},
  dateTimeFormats: {}
});

```

template
```html
<div>
  {{ $t('key') }}
  {{ $n(10, 'short') }}
  {{ $d(new Date(), 'short') }}
</div>
```

> 详细参数参考 [@all-in-js/i18n-core](https://github.com/all-in-js/i18n);

### 指令

* **v-i18n**

  对应 `$t` 函数
  
  - 当传入字符串时，如 `v-i18n="key"`，等同于：`$t(key)`
  - 当传入数组时，如 `v-i18n="[key, param]"`，等同于：`$t(key, param)`

* **v-i18n.number**

  对应 `$n` 函数

  - 仅支持传入数组，如 `v-i18n.number="[value, optionAlias]"`，等同于：`$n(value, optionAlias)`

* **v-i18n.date**

  对应 `$d` 函数

  - 仅支持传入数组，如 `v-i18n.date="[value, optionAlias]"`，等同于：`$d(value, optionAlias)`