import { classnames } from '@src/ui/styles/classnames'
import { inlineButton, list, section, text } from '@src/ui/styles/utils'
import React from 'react'

type SchemasErrorProps = {
  onClickClearData: () => void
}
export default function SchemasError({ onClickClearData }: SchemasErrorProps): React.ReactElement {
  return (
    <div className={classnames(section, 'p-4', 'max-w-lg', 'bg-red-50')}>
      <p className={text}>Sorry, there was a problem loading your previously saved schemas.</p>
      <p className={text}>
        Please try the following:
        <ul className={list}>
          <li>Reload the page</li>
          <li>
            <button
              type="button"
              onClick={onClickClearData}
              className={classnames(inlineButton, 'hover:bg-green-100')}
            >
              Reset your data
            </button>
          </li>
          <li>
            <pre className={classnames('inline', 'text-xs')}>localStorage.clear()</pre> in your
            console
          </li>
        </ul>
      </p>
    </div>
  )
}
