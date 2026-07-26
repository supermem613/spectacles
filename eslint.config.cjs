module.exports = [
  {
    ignores: ['out/**', 'node_modules/**', '.vscode-test/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser')
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {},
  },
];
