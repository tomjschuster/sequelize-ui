import { classnames } from '@src/ui/styles/classnames'
import { fullscreen } from '@src/ui/styles/utils'

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

export const titleContainer = classnames(
  'relative',
  'h-8',
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

export const logoContainer = classnames('p-1', 'flex', 'items-center')

export const logo = classnames('h-6')

export const closeButton = classnames('p-0.5', 'hover:bg-gray-200')

export const controlsContainer = classnames(
  'relative',
  'overflow-visible',
  'h-9',
  'flex',
  'items-center',
  'border-b',
  'border-gray-900',
)

export const contentContainer = classnames('flex-auto', 'overflow-y-scroll')

export const actionsContainer = classnames('text-sm', 'flex', 'w-full')

export const actionButton = classnames('py-1', 'px-2', 'hover:bg-gray-200')
