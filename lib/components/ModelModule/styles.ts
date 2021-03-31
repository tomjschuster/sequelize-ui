import { classnames } from 'tailwindcss-classnames'

export const modelList = classnames('p-4', 'border-solid')

export const modelItem = classnames('border-solid', 'border-black', 'border')

export const modelName = classnames([
  'block',
  'p-2',
  'border-solid',
  'hover:bg-gray-200',
  'cursor-pointer',
])

export const fieldList = classnames('list-disc', 'pl-8', 'border-t', 'border-black', 'border-solid')
