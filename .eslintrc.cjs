module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: [
    'import',
    'jest',
    'jsdoc',
    'security',
    'prettier',
  ],

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:jsdoc/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
  ],

  rules: {
    /* General JS rules (SAFE for students) */
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-debugger': 'error',

    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        semi: true,
      },
    ],
  },

  overrides: [
    /* =====================
       TypeScript
    ====================== */
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports' },
        ],
      },
    },

    /* =====================
       Test files
    ====================== */
    {
      files: ['**/*.test.*', '**/*.spec.*'],
      rules: {
        'max-lines': 'off',
        'no-magic-numbers': 'off',
        'no-console': 'off',
      },
    },

    /* =====================
       Examples / Exercises
    ====================== */
    {
      files: ['**/examples/**', '**/exercises/**'],
      rules: {
        'no-console': 'off',
        'no-var': 'off',
        'prefer-const': 'off',
        'max-classes-per-file': 'off',
        'no-plusplus': 'off',
        'no-nested-ternary': 'off',
        'no-shadow': 'off',
        'no-restricted-syntax': 'off',
        'guard-for-in': 'off',
        'no-prototype-builtins': 'off',
        'no-else-return': 'off',
        'import/no-default-export': 'off',
        'security/detect-object-injection': 'off',
        'security/detect-possible-timing-attacks': 'off',
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.cjs',
    '*.d.ts',
  ],
};
