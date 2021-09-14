import { classnames } from '@src/ui/classnames'
import { fullscreen } from '@src/ui/utils/classnames'

export const container = classnames(
  fullscreen,
  'bg-white',
  'overflow-y-scroll',
  'z-10',
  'border-gray-500',
  'border-2',
)
export const grid = classnames('h-full', 'grid', 'grid-cols-12')

export const titleCell = classnames(
  'relative',
  'flex',
  'items-center',
  'justify-between',
  'border-b',
  'border-gray-900',
  'p-1',
  'pt-0',
  'row-start-1',
  'row-end-2',
  'col-start-1',
  'col-end-13',
)

export const close = classnames('p-1', 'w-12')

export const controlsCell = classnames(
  'relative',
  'overflow-visible',
  'border-b',
  'border-gray-900',
  'h-full',
  'py-1',
  'px-2',
  'row-start-2',
  'row-end-3',
  'col-start-1',
  'col-end-13',
)

export const dbFormOverlay = classnames(
  'absolute',
  'bg-indigo-50',
  'p-4',
  'pt-8',
  'mt-1',
  '-ml-2',
  'border',
  'shadow-md',
  'w-screen',
  'md:w-auto',
  'lg:w-auto',
)

export const closeDbForm = classnames('pr-2', 'pt-2', 'w-12', 'absolute', 'right-0', 'top-0')

export const actions = classnames('bg-white', 'text-sm', 'flex', 'w-full')

export const download = classnames('p-2')
export const copy = classnames('p-2')

export const fileTreeCell = classnames(
  'border-b',
  'border-gray-900',
  'bg-gray-100',
  'text-gray-600',
  // 'p-2',
  'h-full',
  'overflow-y-scroll',
  'row-start-3',
  'row-end-4',
  'col-start-1',
  'col-end-13',
  'lg:row-start-3',
  'lg:row-end-6',
  'lg:col-start-1',
  'lg:col-end-5',
)

export const codeCell = classnames(
  'h-full',
  'overflow-y-scroll',
  'row-start-4',
  'row-end-6',
  'col-start-1',
  'col-end-13',
  'lg:row-start-3',
  'lg:row-end-6',
  'lg:col-start-5',
  'lg:col-end-13',
)
