import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextConfig from 'eslint-config-next'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import { fixupConfigRules, includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

const config = [
  includeIgnoreFile(gitignorePath),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Wrap and fixup the Next config
  ...fixupConfigRules(nextConfig).map((config) => {
    // If the config object defines plugins, check for the conflict
    if (config.plugins?.['@typescript-eslint']) {
      const { '@typescript-eslint': ts, ...rest } = config.plugins
      return {
        ...config,
        plugins: {
          ...rest,
          // Re-map the Next-provided TS plugin to a unique name to avoid the collision
          'next-ts-compat': ts,
        },
      }
    }
    return config
  }),

  prettierPlugin,

  {
    languageOptions: {
      parser: tsParser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/use-memo': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
  {
    files: [
      '**/jest.config.js',
      '**/next.config.js',
      '**/next-sitemap.js',
      '**/postcss.config.js',
      '**/tailwind.config.js',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettierConfig,
]

export default config
