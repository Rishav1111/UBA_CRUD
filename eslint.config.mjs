import globals from 'globals';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vitest from 'eslint-plugin-vitest';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/', 'node_modules/', 'html/', 'src/graphql/'],
    },
    {
        files: ['src/**/*.{js,ts,cjs,tsx}', 'tests/**/*.{js,ts,cjs,tsx}'],
        languageOptions: {
            parser: tsParser,
            sourceType: 'module',
            globals: globals.node,
        },
        extends: [
            'plugin:@typescript-eslint/recommended',
            'prettier',
            'eslint:recommended',
        ],
        plugins: {
            '@typescript-eslint': tsPlugin,
            vitest,
            prettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/ban-ts-comment': 'warn', // Adjust this rule as needed
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
    js.configs.recommended,
    tsPlugin.configs.recommended,
    vitest.configs.recommended,
    prettierConfig, // Ensure Prettier conflicts are handled correctly
];
