// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-class-properties', { 'loose': true }]]
};
