import { classnames } from '@src/ui/styles/classnames'
import { inlineButton } from '@src/ui/styles/utils'

export const container = classnames(
  'p-4',
  'border',
  'border-gray-500',
  'rounded',
  'bg-red-50',
  'w-full',
  'max-w-lg',
)

export const text = classnames('text-sm', 'mb-2')
export const list = classnames('text-sm', 'list-disc', 'list-inside', 'leading-loose')
export const clearDataButton = classnames(inlineButton, 'hover:bg-green-100')
export const lsCode = classnames('inline', 'text-xs')
