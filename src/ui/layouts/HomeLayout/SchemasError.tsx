import {
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  fontSize,
  maxWidth,
  padding,
  toClassname,
} from '@src/ui/styles/classnames'
import { inlineButton, list, section, text } from '@src/ui/styles/utils'
import React from 'react'

type SchemasErrorProps = {
  onClickClearData: () => void
}
export default function SchemasError({ onClickClearData }: SchemasErrorProps): React.ReactElement {
  return (
    <div
      className={classnames(
        section,
        padding('p-4'),
        maxWidth('max-w-lg'),
        backgroundColor('bg-red-50', 'dark:bg-red-900'),
        borderRadius('rounded'),
        borderWidth('border'),
        borderColor('border-red-900', 'dark:border-red-100'),
      )}
    >
      <p className={text}>Sorry, there was a problem loading your previously saved schemas.</p>
      <p className={text}>Please try the following:</p>
      <ul className={list}>
        <li>Reload the page</li>
        <li>
          <button
            type="button"
            onClick={onClickClearData}
            className={classnames(
              inlineButton(backgroundColor('bg-gray-100', toClassname('dark:hover:bg-red-800'))),
            )}
          >
            Reset your data
          </button>
        </li>
        <li>
          <code className={classnames(display('inline'), fontSize('text-xs'))}>
            localStorage.clear()
          </code>{' '}
          in your console
        </li>
      </ul>
    </div>
  )
}
