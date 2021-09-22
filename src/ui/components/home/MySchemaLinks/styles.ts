import { classnames } from '@src/ui/classnames'
import { button, buttonGrid } from '@src/ui/utils/classnames'

export const container = classnames(buttonGrid)

export const newSchemaIcon = classnames('mr-2')
export const addButtonLink = classnames(
  button,
  'min-h-16',
  'h-full',
  'bg-white',
  'hover:bg-green-50',
  'text-lg',
  'border-dashed',
)

export const schemaButtonLink = classnames(
  button,
  'min-h-20',
  'bg-white',
  'h-full',
  'hover:bg-indigo-50',
)

export const linkText = classnames(
  'font-bold',
  'overflow-ellipsis',
  'overflow-hidden',
  'w-full',
  'mb-2',
)

export const linkMeta = classnames('flex', 'flex-col', 'w-full')

export const linkMetaItem = classnames('flex', 'items-center', 'text-xs')
export const linkMetaIcon = classnames('mr-1')
