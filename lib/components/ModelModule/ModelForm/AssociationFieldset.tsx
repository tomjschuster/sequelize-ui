import { Association } from '@lib/core'
import React from 'react'

type AssociationFieldsetProps = {
  association: Association
  onChange: (id: Association['id'], changes: Association) => void
}

function AssociationFieldset({
  association: _association,
  onChange: _onChange,
}: AssociationFieldsetProps): React.ReactElement {
  return <fieldset />
  // target model select
  // type select
  // alias input
  // foreign key input
  // m2m type radio
  // m2m table input
  // m2m model select
  // m2m target fk
}

export default React.memo(AssociationFieldset)
