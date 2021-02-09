const I18n = require('@open-fe/i18n-core');

function install(Vue, option) {
  if (install.installed) return;
  install.installed = true;
  
  const i18n$ = new I18n(option);
  Vue.i18n$ = i18n$;
  Vue.mixin({
    data() {
      return {
        i18n$
      }
    },
    methods: {
      $t() {
        return i18n$.t.apply(i18n$, arguments);
      },
      $d() {
        return i18n$.d.apply(i18n$, arguments);
      },
      $n() {
        return i18n$.n.apply(i18n$, arguments);
      },
      $tc() {}
    },
  });
  Vue.directive('i18n', function(el, { value, modifiers }) {
    if (value) {
      if (!Object.keys(modifiers).length) {
        // 没有修饰符时
        if (typeof value === 'string') {
          el.textContent = i18n$.t(value);
        } else if (Array.isArray(value)) {
          // const [path, param] = value;
          el.textContent = i18n$.t.apply(i18n$, value);
        }
      } else {
        if (modifiers.date) {
          // date修饰符
          if (Array.isArray(value)) {
            // const [value, optionAlias, locale] = value;
            el.textContent = i18n$.d.apply(i18n$, value);
          }
        }

        if (modifiers.number) {
          // number修饰符
          if (Array.isArray(value)) {
            // const [value, optionAlias, locale] = value;
            el.textContent = i18n$.n.apply(i18n$, value);
          }
        }
      }
    }
  });
  Vue.directive('v-i18n-dir', function (el) {
    const direction = (i18n$.direction).toString().toLowerCase();
    const prefix = 'i18n-dir-';
    const classes = el.classList;
    classes.forEach(clas => {
      if (clas.startsWith(prefix)) {
        classes.remove(clas);
      }
    });
    if (direction === 'rtl') {
      el.classList.add(prefix + direction);
    }
  });
};

const VueI18n = {
  install
}

module.exports = VueI18n;