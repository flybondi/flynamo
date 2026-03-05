import neostandard from 'neostandard';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  ...neostandard({ noStyle: true }),
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        jest: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    rules: {
      semi: [2, 'always'],
      'no-extra-semi': 2,
      strict: ['error', 'global'],
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  }
];
