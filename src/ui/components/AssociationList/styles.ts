import { classnames } from '@src/ui/classnames'

export const modelList = classnames('p-4', 'border-solid')

export const modelItem = (last: boolean): string =>
  classnames({
    'border-solid': true,
    'border-black': true,
    border: true,
    'border-b-0': !last,
  })

export const modelName = classnames(
  'block',
  'p-2',
  'border-solid',
  'hover:bg-gray-200',
  'cursor-pointer',
)

export const fieldList = classnames('list-disc', 'pl-8', 'border-t', 'border-black', 'border-solid')
