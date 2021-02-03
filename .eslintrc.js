module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'max-len': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'never',
    }],
  },
};
