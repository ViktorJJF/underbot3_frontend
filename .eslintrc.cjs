/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-async-promise-executor': 'off',
    'no-prototype-builtins': 'off',
    'no-redeclare': 'error',
    'no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '[vue/valid-v-for]': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/attributes-order': 'off',
    'vue/attribute-hyphenation': 'off',
  },
};
