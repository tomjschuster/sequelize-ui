import { classnames } from '@src/ui/classnames'

export const modelList = classnames('p-4', 'border-solid')

export const modelItem = classnames('border-solid', 'border-black', 'border')

export const modelName = (disabled: boolean): string =>
  classnames({
    block: true,
    'p-2': true,
    'border-solid': true,
    'hover:bg-gray-200': true,
    'cursor-pointer': !disabled,
  })

export const fieldList = classnames('list-disc', 'pl-8', 'border-t', 'border-black', 'border-solid')
