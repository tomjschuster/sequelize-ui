import { classnames } from '@src/ui/styles/classnames'
import { button, buttonGrid } from '@src/ui/styles/utils'

export const container = classnames(buttonGrid)

export const newSchemaIcon = classnames('mr-2')
export const newButton = classnames(
  button,
  'min-h-16',
  'h-full',
  'bg-white',
  'hover:bg-green-50',
  'text-lg',
  'border-dashed',
)

export const schemaButton = classnames(
  button,
  'min-h-20',
  'bg-white',
  'h-full',
  'hover:bg-indigo-50',
)

export const buttonText = classnames(
  'font-bold',
  'overflow-ellipsis',
  'overflow-hidden',
  'w-full',
  'mb-2',
)

export const meta = classnames('flex', 'flex-col', 'w-full')

export const metaItem = classnames('flex', 'items-center', 'text-xs')
export const metaIcon = classnames('mr-1')
