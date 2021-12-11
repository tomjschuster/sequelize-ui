import { classnames } from './classnames'

export const fullscreen = classnames('h-screen', 'w-screen', 'fixed', 'top-0', 'left-0')

export const section = classnames('w-full', 'flex', 'flex-col', 'max-w-screen-lg', 'mx-auto')

export const largeTitle = classnames('text-2xl', 'mb-4')

export const text = classnames('text-sm', 'mb-2')

export const flexCenter = classnames('flex', 'items-center', 'justify-center', 'flex-wrap')

export const panelGrid = classnames(
  'grid',
  'lg:grid-cols-3',
  'md:grid-cols-2',
  'sm:grid-cols-2',
  'grid-cols-1',
  'gap-6',
  'auto-rows-fr',
  'w-full',
)

export const panel = classnames('border', 'border-gray-400', 'p-2', 'rounded', 'bg-white')

export const panelButton = classnames(
  panel,
  flexCenter,
  'w-full',
  'text-sm',
  'hover:border-gray-800',
)

export const panelAction = classnames(
  panel,
  flexCenter,
  'w-full',
  'h-full',
  'text-lg',
  'border-dashed',
)

export const list = classnames('text-sm', 'list-disc', 'list-inside', 'leading-loose')

export const inlineButton = classnames(panel, 'py-0.5', 'px-1.5', 'p-0.5', 'hover:bg-gray-100', {
  flex: false,
  'w-full': false,
  'inline-flex': true,
})

export const newButton = classnames(
  panelButton,
  'min-h-16',
  'h-full',
  'bg-white',
  'hover:bg-green-50',
  'text-lg',
  'border-dashed',
)
