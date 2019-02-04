module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/prop-name-casing": ["error", "snake_case"],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/multiline-html-element-content-newline": ["off"],
    "vue/max-attributes-per-line": ["off"]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

