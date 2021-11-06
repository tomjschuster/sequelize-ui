import { displayDataType, Field } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { noCase } from '@src/utils/string'

type FieldViewProps = {
  field: Field
}
function FieldView({ field }: FieldViewProps) {
  return (
    <div
      className={classnames(
        'p-4',
        'pt-8',
        'grid',
        'grid-cols-12',
        'gap-y-2',
        'gap-x-4',
        'relative',
      )}
    >
      <div className={classnames('col-span-12')}>
        <p>Name: {noCase(field.name)}</p>
      </div>
      <div className={classnames('col-span-12')}>
        <p>Data type: {displayDataType(field.type)}</p>
      </div>
    </div>
  )
}

export default React.memo(FieldView)
