import { classnames } from 'tailwindcss-classnames'

export const modelList = classnames('p-4', 'border-solid')

export const modelItem = (first: boolean): string =>
  classnames({
    'p-2': true,
    'border-solid': true,
    'border-black': true,
    border: true,
    'border-t-0': !first,
  })

export const fieldList = classnames('list-disc', 'pl-8')
