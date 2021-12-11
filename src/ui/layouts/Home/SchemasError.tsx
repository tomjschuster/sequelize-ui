import { classnames } from '@src/ui/styles/classnames'
import { inlineButton } from '@src/ui/styles/utils'
import React from 'react'

export const container = classnames(
  'p-4',
  'max-w-lg',
  'border',
  'border-gray-500',
  'rounded',
  'bg-red-50',
  'w-full',
)

export const text = classnames('text-sm', 'mb-2')
export const list = classnames('text-sm', 'list-disc', 'list-inside', 'leading-loose')
export const clearDataButton = classnames(inlineButton, 'hover:bg-green-100')
export const lsCode = classnames('inline', 'text-xs')

type SchemasErrorProps = {
  onClickClearData: () => void
}
export default function SchemasError({ onClickClearData }: SchemasErrorProps): React.ReactElement {
  return (
    <div className={container}>
      <p className={text}>Sorry, there was a problem loading your previously saved schemas.</p>
      <p className={text}>
        Please try the following:
        <ul className={list}>
          <li>Reload the page</li>
          <li>
            <button type="button" onClick={onClickClearData} className={clearDataButton}>
              Reset your data
            </button>
          </li>
          <li>
            <pre className={lsCode}>localStorage.clear()</pre> in your console
          </li>
        </ul>
      </p>
    </div>
  )
}
