## @open-fe/vue-i18n

> 基于 `@open-fe/i18n-core` 和 `Vue` 的国际化处理方案

### Install

```bash
npm i @open-fe/vue-i18n
// or
yarn add @open-fe/vue-i18n
```

### Usage

main.js
```js
import Vue from 'vue';
import VueI18n from '@open-fe/vue-i18n';

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

> 详细参数参考 [@open-fe/i18n-core](https://github.com/famanoder/i18n.git);

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