## 国际化词条管理工具

一般在需求开发完毕后可以先执行一次 `i18n collect` 来提取中文词条，确认无误后，再执行 `i18n push` 即可对词条进行初步的匹配，不一定有值，并将所有词条同步到服务端；

到词条管理平台进行词条的管理，比如导出 `Excel` 文件对接翻译公司，或者进行一些测试性的修改；

当您在管理平台对词条进行编辑后，记得到项目中执行 `i18n pull` 将您的修改更新到本地；

### 安装

```js
npm i -g @open-fe/i18n-cli
```

### 使用

* **i18n collect**

用来抽取项目中的中文词条，并生成或修改 `zh-CN.js`

```js
i18n collect [--dir] [--ignoredir]
```

* **i18n push**

用来将本地语言包及相关词条同步到服务端，存储和初步匹配，如果您本地对词条有所改动或者在初始情况下，一律执行 `i18n push` 就行；

```js
i18n [push] [--dir] [--lang]
```

* **i18n pull**

一般情况下，您可能不需要执行这个命令，如果想获取平台上其他项目已翻译的词条，执行 `i18n push` 即可；
`i18n pull` 的存在，是用来获取通过管理平台对当前项目的词条的人为改动，比如：您在管理平台是把当前项目里的一个词条的翻译结果进行了校对，做了修改，那么就需要在本地执行 `i18n pull` 来获取您的修改；


```js
i18n pull [--dir] [--lang]
```

* **i18n export**

用来导出未翻译词条，支持导出未 `xlsx` 和 `json`

```js
i18n export [--json] [--excel] [--lang]
```

* **i18n import**

用来将翻译后的 `excel` 文件导入到词条管理平台，并更新本地相应语言的词条

> 传入的文件名格式需满足 `{xxx}.{lang}.{ext}`，`ext` 暂时只支持 `json` 和 `xlsx`

```js
i18n import <file>

// or

i18n import <--file>
```

### 参数

| 参数名 | 简写 | 说明 | 默认值 | 
| ----- | ----- | ----- | ----- |
| dir | d | 需要进行国际化处理的目录，多个逗号隔开 | src/modules,components |
| ignoredir | i | 需要忽略的文件或者文件夹 如 -i 'i18n,car.js' 会忽略掉所有的 `i18n` 文件夹 及 `car.js`文件 | 无论传不传此参数，都会忽略掉`i18n`文件夹 |
| lang | l | 需要做国际化的语言，多个逗号隔开 | en-US |
| excel | excel | 导出未翻译的词条为excel文件 | true |
| json | json | 导出未翻译的词条为json文件 | false |
| file | f | 导入的文件名 | - |
| host | h | 测试host | http://localhost:3100 |