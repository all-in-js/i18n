function getArgType(agr) {
  const type = Object.prototype.toString.call(agr).split(/\s/)[1].slice(0, -1).toLowerCase();
  const obj = {};
  ['Array', 'Boolean', 'Number', 'Object', 'Promise', 'String', 'Map', 'RegExp', 'Set', 'Weakmap', 'Weakset', 'Symbol', 'Null', 'Undefined'].forEach(item => {
    obj[`is${item}`] = item.toLowerCase() === type;
  });
  obj.isFunction = ['asyncfunction', 'generatorfunction', 'function'].indexOf(type) >= 0;
  return obj;
}

const logTypeMap = [
  ['info', '#00BCD4'],
  ['warn', '#f39c12'],
  ['error', '#c0392b'],
  ['done', '#2ecc71']
];

const log = {
  _verbose: true,
  set verbose(bool) {
    this._verbose = bool;
  },
  get verbose() {
    return this._verbose;
  }
};

for (const [type, bg] of logTypeMap) {
  log[type] = function(msg = '', tag = '') {
    if (log.verbose) {
      const agrs = [
        `%c ${type.toUpperCase()} ${tag ? `%c ${tag}` : '%c'}%c ${msg}`,
        `color:#fff;background:${bg};`,
        tag ? 'color: #da6ed1;' : '',
        ``
      ];
      console.log.apply(console, agrs);
    }
  }
}


function template(templ, conf) {
	let pars = templ && templ.match(/{.+?}/g);
	if (pars && conf) {
		pars = pars.map(p => p.replace(/\{\s*(\w+|\d+).*?\}/, '$1'));
		pars.forEach((c, i) => {
			let reg = new RegExp('{\\s*'+c+'\\s*(?:=\\s*(\\S*?))?\\s*?}', 'g');
			templ = templ.replace(reg, (a, b) => {
        return getArgType(conf[c]).isFunction ?
                conf[c]() :
                (conf[c] !== undefined ?
                  conf[c] :
                  (b ?
                    b :
                    a
                  )
                );
			});
		});
	}
	return templ;
}

function createRTLStyle() {
  const css = 'html.rtl,.i18n-direction-rtl { direction: rtl };';
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');

  head.appendChild(style);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
}

module.exports = {
  log,
  getArgType,
  template,
  createRTLStyle
}