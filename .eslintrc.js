module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'unused-imports',
    'deprecation',
    'disable',
  ],
  processor: 'disable/disable',
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  overrides: [
    {
      files: ['test/**', '**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
    {
      files: ['config.ts'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
    {
      files: ['**/**/*.js', '*.js'],
      settings: {
        'disable/plugins': ['@typescript-eslint'],
      },
    },
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'deprecation/deprecation': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': [
      2,
      {
        ignoreProperties: true,
      },
    ],

    'import/prefer-default-export': 0,
    'import/no-default-export': 2,

    // do not enforce arrow body functions to be one liners
    'implicit-arrow-linebreak': 0,

    'unused-imports/no-unused-imports': 'error',

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
        warnOnUnassignedImports: true,
      },
    ],

    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],

    // see more options here: https://eslint.org/docs/rules/max-len
    'max-len': [
      2,
      {
        code: 100,
        ignoreComments: true,
        ignorePattern: '^import\\W.*',
        ignoreRegExpLiterals: true,
      },
    ],
    'prettier/prettier': ['error'],
  },
};
