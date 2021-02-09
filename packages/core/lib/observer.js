function Observer(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
  return obj;
};

function observe(value) {
  if (!value || typeof value !== 'object') {
    return;
  }
  Observer(value);
};

function defineReactive(obj, key, value) {
  let childObj = observe(obj[key]);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (value === newVal) {
        return;
      }
      value = newVal;
      // 值有变化时自定义操作
      const cb = obj.callback[key];
      cb.call(obj);

      // 对新值添加set,get
      childObj = observe(newVal);
    }
  });
};

module.exports = Observer;