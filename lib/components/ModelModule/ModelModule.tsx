import { Model, Schema } from '@lib/core'
import React from 'react'
import ModelForm from './ModelForm'
import ModelItem from './ModelItem'

type ModelModuleProps = {
  schema: Schema
  model: Model
  editing: boolean
  disabled: boolean
  onRequestEdit: () => void
  onChange: (model: Model) => Promise<void>
  onRequestCancel: () => void
}
export default function ModelModule({
  schema,
  model,
  editing,
  disabled,
  onChange,
  onRequestEdit,
  onRequestCancel,
}: ModelModuleProps): React.ReactElement {
  return editing ? (
    <ModelForm model={model} schema={schema} onSubmit={onChange} onCancel={onRequestCancel} />
  ) : (
    <ModelItem disabled={disabled} schema={schema} model={model} onEdit={onRequestEdit} />
  )
}
