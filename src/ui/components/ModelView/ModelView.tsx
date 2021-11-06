import { Model, Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { titleCase } from '@src/utils/string'
import React from 'react'
import AssociationView from './AssociationView'
import FieldView from './FieldView'

export const section = classnames(
  'max-w-screen-lg',
  'px-6',
  'flex',
  'flex-col',
  'mx-auto',
  'mb-6',
  'last:mb-0',
)

export const title = classnames('text-xl', 'mb-2')

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
const panel = classnames('border', 'border-gray-400', 'rounded')

type ModelViewProps = {
  schema: Schema
  model: Model
}

export default function ModelView({ schema, model }: ModelViewProps): React.ReactElement {
  return (
    <div className={classnames(section)}>
      <h2 className={classnames(title)}>Model</h2>
      <div className={classnames('mb-8')}>
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
            <AssociationView association={association} schema={schema} />
          </div>
        ))}
      </div>
    </div>
  )
}
