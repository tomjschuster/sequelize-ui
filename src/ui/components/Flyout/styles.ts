import { classnames } from '@src/ui/classnames'
import { fullscreen } from '@src/ui/utils/classnames'

export const container = classnames(
  fullscreen,
  'bg-gray-50',
  'overflow-y-scroll',
  'z-10',
  'border-gray-500',
  'border-2',
  'flex',
  'flex-col',
)

export const title = classnames(
  'relative',
  'h-10',
  'flex',
  'items-center',
  'justify-between',
  'border-b',
  'bg-gradient-to-r',
  'from-blue-100',
  'to-blue-50',
  'border-gray-900',
  'shadow-inner',
)

export const close = classnames('p-0.5', 'hover:bg-gray-200')
export const titleSiteName = classnames('p-1', 'flex', 'items-center')
export const titleLogo = classnames('h-6')

export const controls = classnames(
  'relative',
  'overflow-visible',
  'h-12',
  'flex',
  'items-center',
  'border-b',
  'border-gray-900',
)

export const content = classnames('flex-auto', 'overflow-y-scroll')

export const actions = classnames('text-sm', 'flex', 'w-full')

export const actionButton = classnames('py-1', 'px-2', 'hover:bg-gray-200')
