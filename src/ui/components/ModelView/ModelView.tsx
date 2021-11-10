import { Model, Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { titleCase } from '@src/utils/string'
import React from 'react'
import AssociationView from './AssociationView'
import FieldView from './FieldView'

export const section = classnames('max-w-screen-lg', 'p-6', 'pt-0', 'flex', 'flex-col', 'mx-auto')

export const title = classnames('text-2xl', 'mb-2')

const grid = classnames(
  'grid',
  'lg:grid-cols-3',
  'md:grid-cols-2',
  'sm:grid-cols-2',
  'grid-cols-1',
  'gap-6',
  'auto-rows-fr',
  'w-full',
)
const panel = classnames('border', 'border-gray-400', 'rounded', 'bg-white')

type ModelViewProps = {
  schema: Schema
  model: Model
  onClickSchema: () => void
  onClickModel: (model: Model) => void
}

export default function ModelView({
  schema,
  model,
  onClickSchema,
  onClickModel,
}: ModelViewProps): React.ReactElement {
  return (
    <div className={classnames(section)}>
      <div className={classnames('py-1')}>
        <button
          className={classnames('font-semibold', 'text-sm', 'hover:underline', '-ml-4')}
          onClick={onClickSchema}
        >
          ← Back to schema
        </button>
      </div>
      <h2 className={classnames(title)}>Model</h2>
      <div className={classnames('mb-11')}>
        <p className={classnames('text-lg')}>Name: {titleCase(model.name)}</p>
      </div>
      <h3 className={classnames(title)}>Fields</h3>

      <div className={classnames(grid)}>
        {model.fields.map((field) => {
          return (
            <div key={field.id} className={classnames(panel)}>
              <FieldView field={field} />
            </div>
          )
        })}
      </div>

      <h3 className={classnames(title, 'mt-6')}>Associations</h3>

      <div className={grid}>
        {model.associations.map((association) => (
          <div key={association.id} className={classnames(panel)}>
            <AssociationView
              association={association}
              schema={schema}
              onClickModel={onClickModel}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
