import { classnames } from '@src/ui/styles/classnames'

export const grid = classnames('h-full', 'grid', 'grid-cols-12')

export const fileTreeCell = classnames(
  'border-b',
  'border-gray-900',
  'bg-gray-100',
  'text-gray-600',
  'overflow-y-scroll',
  'row-span-3',
  'col-span-12',
  'lg:row-span-12',
  'lg:col-span-3',
)

export const codeCell = classnames(
  'overflow-y-scroll',
  'row-span-9',
  'col-span-12',
  'lg:row-span-12',
  'lg:col-span-9',
)
