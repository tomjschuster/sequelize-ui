import { Model, Schema } from '@src/core/schema'
import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import { classnames } from '@src/ui/styles/classnames'
import { titleCase } from '@src/utils/string'
import classnames_ from 'classnames'
import React from 'react'
import { newButton } from '../home/MySchemaLinks/styles'
import PlusCircleIcon from '../icons/Plus'
import AssociationView from './AssociationView'
import FieldView from './FieldView'

export const section = classnames('max-w-screen-lg', 'p-6', 'pt-2', 'flex', 'flex-col', 'mx-auto')

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
  onViewSchema: (model?: Model) => void
  onClickAddField: () => void
  onClickAddAssociation: () => void
}

export default function ModelView({
  schema,
  model,
  onViewSchema,
  onClickAddField,
  onClickAddAssociation,
}: ModelViewProps): React.ReactElement {
  return (
    <div className={classnames(section, 'mb-3')}>
      <div className={classnames('mb-4', 'flex', 'text-sm')}>
        <button
          className={classnames_(
            classnames('font-semibold', 'hover:underline'),
            breadcrumbs.breadcrumb,
          )}
          onClick={() => onViewSchema()}
        >
          {titleCase(schema.name)} (schema)
        </button>
        <span>{titleCase(model.name)} (model)</span>
      </div>
      <h2 className={classnames(title)}>Model</h2>
      <div className={classnames('mb-11')}>
        <p className={classnames('text-lg')}>Name: {titleCase(model.name)}</p>
      </div>
      <h3 className={classnames(title)}>Fields</h3>

      <ul className={classnames(grid)}>
        {model.fields.map((field) => {
          return (
            <li key={field.id} className={classnames(panel)}>
              <FieldView field={field} />
            </li>
          )
        })}
        <li>
          <button type="button" className={newButton} onClick={onClickAddField}>
            <span>
              <PlusCircleIcon />
            </span>
            Add Field
          </button>
        </li>
      </ul>

      <h3 className={classnames(title, 'mt-6')}>Associations</h3>

      <ul className={grid}>
        {model.associations.map((association) => (
          <li key={association.id} className={classnames(panel)}>
            <AssociationView
              association={association}
              schema={schema}
              onClickModel={onViewSchema}
            />
          </li>
        ))}
        <li>
          <button type="button" className={newButton} onClick={onClickAddAssociation}>
            <span>
              <PlusCircleIcon />
            </span>
            Add association
          </button>
        </li>
      </ul>
    </div>
  )
}
