import { blank, lines } from '@src/core/codegen'

export function gitignoreTemplate(): string {
  return lines([
    'node_modules/',
    'dist',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.npm',
    '.tmp',
    blank(),
  ])
}
