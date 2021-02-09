
const presets = [
  [
    '@babel/env',
    {
      modules: 'umd',
      targets: {
        chrome: '67',
        ie: '11'
      }
    }
  ]
];

module.exports = {
  presets,
  exclude: [
    /node_modules/
  ]
};
