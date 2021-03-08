import { blank, lines } from '@sequelize-ui/core'

export const gitignoreTemplate = (): string =>
  lines([
    'node_modules/',
    'dist',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.npm',
    '.tmp',
    blank(),
  ])
