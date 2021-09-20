import { classnames } from '@src/ui/classnames'

export const containerClassName = classnames(
  'grid',
  'md:grid-cols-3',
  'sm:grid-cols-2',
  'grid-cols-1',
  'gap-6',
  'max-w-screen-lg',
  'lg:w-5/6',
  'pt-6',
)

export const linkClassName = classnames(
  'text-sm',
  'p-2',
  'border',
  'border-gray-400',
  'hover:border-gray-800',
  'hover:bg-blue-100',
  'rounded',
  'min-h-24',
  'w-full',
  'flex',
  'flex-col',
  'justify-between',
)

export const linkTextClassName = classnames('font-bold', 'overflow-ellipsis', 'overflow-hidden')
export const linkMetaClassName = classnames('flex', 'flex-col', 'items-start')

export const linkMetaItemClassName = classnames('flex', 'items-center', 'text-xs')
export const linkMetaIconClassName = classnames('mr-1')
