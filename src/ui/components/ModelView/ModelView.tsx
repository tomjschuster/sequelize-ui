import { Model, Schema } from '@src/core/schema'
import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import { classnames, toClassname } from '@src/ui/styles/classnames'
import { largeTitle, newButton, panel, panelGrid, section } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import PlusCircleIcon from '../icons/Plus'
import AssociationView from './AssociationView'
import FieldView from './FieldView'

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
    <div className={classnames(section, 'p-6', 'pt-2', 'mb-3')}>
      <div className={classnames('mb-4', 'flex', 'text-sm')}>
        <button
          className={classnames(
            'font-semibold',
            'hover:underline',
            toClassname(breadcrumbs.breadcrumb),
          )}
          onClick={() => onViewSchema()}
        >
          {titleCase(schema.name)} (schema)
        </button>
        <span>{titleCase(model.name)} (model)</span>
      </div>
      <h2 className={classnames(largeTitle)}>Model</h2>
      <div className={classnames('mb-11')}>
        <p className={classnames('text-lg')}>Name: {titleCase(model.name)}</p>
      </div>
      <h3 className={classnames(largeTitle)}>Fields</h3>

      <ul className={classnames(panelGrid)}>
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
              <PlusCircleIcon size={6} />
            </span>
            Add Field
          </button>
        </li>
      </ul>

      <h3 className={classnames(largeTitle, 'mt-6')}>Associations</h3>

      <ul className={panelGrid}>
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
              <PlusCircleIcon size={6} />
            </span>
            Add association
          </button>
        </li>
      </ul>
    </div>
  )
}
