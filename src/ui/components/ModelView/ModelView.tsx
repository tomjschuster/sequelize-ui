import { Model, Schema } from '@src/core/schema'
import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import {
  backgroundColor,
  classnames,
  display,
  fontSize,
  fontWeight,
  margin,
  minHeight,
  padding,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
import { panel, panelGrid, section, title } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import PanelButton from '../form/PanelButton'
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
    <div className={classnames(padding('pt-2', 'px-6'), margin('mb-3'))}>
      <div className={classnames(margin('mb-4'), display('flex'), fontSize('text-sm'))}>
        <button
          className={classnames(
            fontWeight('font-semibold'),
            textDecoration('hover:underline'),
            toClassname(breadcrumbs.breadcrumb),
          )}
          onClick={() => onViewSchema()}
        >
          {titleCase(schema.name)} (schema)
        </button>
        <span>{titleCase(model.name)} (model)</span>
      </div>
      <div className={classnames(section)}>
        <h2 className={classnames(title)}>Model</h2>
        <div className={classnames(margin('mb-11'))}>
          <p className={classnames(fontSize('text-lg'))}>Name: {titleCase(model.name)}</p>
        </div>
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(title)}>Fields</h3>

        <ul className={classnames(panelGrid)}>
          {model.fields.map((field) => {
            return (
              <li key={field.id} className={classnames(panel)}>
                <FieldView field={field} />
              </li>
            )
          })}
          <li>
            <PanelButton
              label="Add Field"
              className={classnames(backgroundColor('hover:bg-green-50'))}
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={onClickAddField}
            />
          </li>
        </ul>
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(title, margin('mt-6'))}>Associations</h3>

        <ul className={panelGrid}>
          {model.associations.map((association) => (
            <li key={association.id} className={classnames(panel, minHeight('min-h-22'))}>
              <AssociationView
                association={association}
                schema={schema}
                onClickModel={onViewSchema}
              />
            </li>
          ))}
          <li>
            <PanelButton
              label="Add association"
              className={classnames(backgroundColor('hover:bg-green-50'))}
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={onClickAddAssociation}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}
