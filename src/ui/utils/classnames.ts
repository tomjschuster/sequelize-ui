import { classnames } from '@src/ui/classnames'

export const fullscreen = classnames('h-screen', 'w-screen', 'fixed', 'top-0', 'left-0')

export const buttonGrid = classnames(
  'grid',
  'md:grid-cols-3',
  'sm:grid-cols-2',
  'grid-cols-1',
  'gap-6',
  'auto-rows-fr',
  'max-w-screen-lg',
  'lg:w-5/6',
  'w-full',
)

const buttonBase = classnames(
  'text-sm',
  'border',
  'border-gray-400',
  'hover:border-gray-800',
  'rounded',
  'flex-wrap',
  'items-center',
  'justify-center',
)

export const button = classnames(buttonBase, 'p-2', 'w-full', 'flex')

export const inlineButton = classnames(
  buttonBase,
  'py-0.5',
  'px-1.5',
  'inline-flex',
  'p-0.5',
  'bg-white',
  'hover:bg-gray-100',
)
