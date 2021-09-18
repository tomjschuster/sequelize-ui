import { classnames } from '@src/ui/classnames'
import { fullscreen } from '@src/ui/utils/classnames'

export const container = classnames(
  fullscreen,
  'bg-white',
  'overflow-y-scroll',
  'z-10',
  'border-gray-500',
  'border-2',
  'flex',
  'flex-col',
)

export const title = classnames(
  'relative',
  'flex-1',
  'h-32',
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

export const close = classnames('p-1', 'hover:bg-gray-200')
export const titleSiteName = classnames('p-1', 'flex', 'items-center')
export const titleLogo = classnames('h-6', 'pr-2')

export const controls = classnames(
  'relative',
  'overflow-visible',
  'flex-1',
  'h-40',
  'border-b',
  'border-gray-900',
)

export const content = classnames('flex-auto', 'overflow-y-scroll')

export const actions = classnames('text-sm', 'flex', 'w-full')

export const actionButton = classnames('p-2', 'hover:bg-gray-100')
