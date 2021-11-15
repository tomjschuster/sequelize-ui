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
  'lg:col-span-4',
)

export const codeCell = classnames(
  'overflow-y-scroll',
  'row-span-9',
  'col-span-12',
  'lg:row-span-12',
  'lg:col-span-8',
)

export const closeDbForm = classnames('p-0.5', 'absolute', 'right-1', 'top-1')

export const dbFormOverlay = classnames(
  'absolute',
  'top-full',
  'rounded-lg',
  'right-0',
  'bg-gray-50',
  'p-4',
  'pt-10',
  'border',
  'border-gray-900',
  'shadow-2xl',
  'w-screen',
  'md:w-auto',
  'lg:w-auto',
)
