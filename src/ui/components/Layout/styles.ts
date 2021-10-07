import { classnames } from '@src/ui/styles/classnames'

export const pageWrapper = classnames(
  'bg-gray-50',
  'flex',
  'flex-col',
  'items-stretch',
  'h-screen',
  'w-screen',
)
export const header = classnames('shadow', 'p-2', 'flex', 'items-center')
export const logoLink = classnames('inline-block')
export const logoHeading = classnames('text-2xl', 'flex', 'items-center')
export const logo = classnames('inline', 'mr-2', 'h-8')
export const main = classnames('flex-1')

export const footer = classnames(
  'shadow-inner',
  'bg-indigo-50',
  'p-2',
  'flex',
  'justify-between',
  'items-center',
  'children:flex',
  'flex-col',
  'sm:flex-row-reverse',
)

export const copyright = classnames('mt-2', 'sm:mt-0', 'text-sm')
export const authorLink = classnames('hover:underline', 'font-bold', 'text-sm', 'ml-1.5')
