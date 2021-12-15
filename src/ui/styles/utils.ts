import { classnames } from './classnames'

export const fullscreen = classnames('h-screen', 'w-screen', 'fixed', 'top-0', 'left-0')

export const flexCenter = classnames('flex', 'items-center', 'justify-center')

export const flexCenterBetween = classnames('flex', 'items-center', 'justify-between')

export const section = classnames('w-full', 'flex', 'flex-col', 'max-w-screen-lg', 'mx-auto')

export const largeTitle = classnames('text-2xl', 'mb-4')

export const text = classnames('text-sm', 'mb-2')

export const list = classnames('text-sm', 'list-disc', 'list-inside', 'leading-loose')

const panelBase = classnames('border', 'border-gray-400', 'p-2', 'rounded', 'bg-white')

export const panel = classnames(panelBase, 'w-full', 'h-full')

export const panelAction = classnames(panel, flexCenter, 'hover:border-gray-800')

export const inlineButton = classnames(panelBase, 'py-0.5', 'px-1.5', 'p-0.5', 'hover:bg-gray-100')

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

export const fieldsetGrid = classnames(
  'p-4',
  'pt-8',
  'grid',
  'grid-cols-12',
  'gap-y-0',
  'gap-x-4',
  'relative',
)
