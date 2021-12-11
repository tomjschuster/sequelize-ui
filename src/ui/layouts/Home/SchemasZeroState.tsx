import { classnames } from '@src/ui/styles/classnames'
import { inlineButton } from '@src/ui/styles/utils'
import React from 'react'

type SchemasZeroStateProps = {
  onClickCreate: () => void
}

export default function SchemasZeroState({
  onClickCreate,
}: SchemasZeroStateProps): React.ReactElement | null {
  return (
    <p className={classnames('text-lg', 'text-center', 'leading-loose')}>
      To get started,{' '}
      <button
        type="button"
        className={classnames(inlineButton, 'font-bold', 'hover:bg-green-100')}
        onClick={onClickCreate}
      >
        create a new schema
      </button>{' '}
      or select one of the demo schemas below.
    </p>
  )
}
