import { displayDataType, Field } from '@src/core/schema'
import { classnames, fontWeight, padding } from '@src/ui/styles/classnames'
import { list, panelHeader } from '@src/ui/styles/utils'
import { noCase } from '@src/utils/string'
import React from 'react'

type FieldViewProps = {
  field: Field
}
function FieldView({ field }: FieldViewProps) {
  return (
    <>
      <p className={classnames(panelHeader)}>
        <span className={classnames(padding('px-1'), fontWeight('font-bold'))}>
          {noCase(field.name)}
        </span>
      </p>
      <ul className={classnames(list, padding('p-2', 'pl-4'))}>
        <li>{displayDataType(field.type)}</li>
        {field.primaryKey && <li>Primary key</li>}
        {field.required && <li>Required</li>}
        {field.unique && <li>Unique</li>}
      </ul>
    </>
  )
}

export default React.memo(FieldView)
