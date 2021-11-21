import React from 'react'
import * as Styles from './styles'

type SchemasZeroStateProps = {
  onClickCreate: () => void
}
export default function SchemasZeroState({
  onClickCreate,
}: SchemasZeroStateProps): React.ReactElement | null {
  return (
    <p className={Styles.text}>
      To get started,
      <button type="button" className={Styles.createButton} onClick={onClickCreate}>
        create a new schema
      </button>{' '}
      or select one of the demo schemas below.
    </p>
  )
}
