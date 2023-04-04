module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2017,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/recommended',
    'eslint-config-prettier',
    'prettier',
  ],
  plugins: ['html', 'eslint-plugin-prettier'],
  rules: {
    quotes: ['error', 'single'],
    // we want to force semicolons
    semi: ['error', 'always'],
    // we use 2 spaces to indent our code
    indent: ['error', 2],
    // we want to avoid extraneous spaces
    'no-multi-spaces': ['error'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
