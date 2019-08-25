// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // always allow new operator
    'no-new': 0,
    // always add dangling comma for multine
    'comma-dangle': [1, 'always-multiline'],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disallow multiple empty lines
    'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 1}],
    // allow customized promise parameter names
    'promise/param-names': 'off',
    // allow floating decimals
    'no-floating-decimal': 'off',
    // allow mixes of different operators
    'no-mixed-operators': 'off',
    // enforce the consistent use of either backticks, double, or single quotes
    quotes: [2, 'single', {allowTemplateLiterals: false}],
  },
  globals: {
    AMap: true
  }
};
