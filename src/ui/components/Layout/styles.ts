import { classnames } from '@src/ui/classnames'

export const pageWrapper = classnames('flex', 'flex-col', 'items-stretch', 'h-screen')
export const header = classnames('shadow', 'p-2')
export const logoLink = classnames('inline-block')
export const logoHeading = classnames('text-2xl')
export const logo = classnames('inline', 'mr-2', 'h-8')
export const main = classnames('flex-1')

export const footer = classnames(
  'shadow-inner',
  'bg-indigo-50',
  'p-4',
  'flex',
  'justify-between',
  'items-center',
  'children:flex',
  'flex-col',
  'sm:flex-row-reverse',
)

export const copyright = classnames('mt-2', 'sm:mt-0')
export const authorLink = classnames('hover:underline', 'font-bold', 'ml-1.5')
