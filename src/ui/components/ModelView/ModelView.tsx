import { Association, Field, Model, Schema } from '@src/core/schema'
import {
  backgroundColor,
  classnames,
  fontSize,
  margin,
  minHeight,
  padding,
} from '@src/ui/styles/classnames'
import { panel, panelGrid, section, title } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import Breadcrumbs from '../Breadcrumbs'
import PanelButton from '../form/PanelButton'
import PlusCircleIcon from '../icons/Plus'
import AssociationView from './AssociationView'
import FieldView from './FieldView'

type ModelViewProps = {
  schema: Schema
  model: Model
  onViewSchema: (model?: Model) => void
  onClickAddField: () => void
  onClickEditField: (field: Field) => void
  onClickDeleteField: (field: Field) => void
  onClickAddAssociation: () => void
  onClickEditAssociation: (association: Association) => void
  onClickDeleteAssociation: (association: Association) => void
}

export default function ModelView({
  schema,
  model,
  onViewSchema,
  onClickAddField,
  onClickEditField,
  onClickDeleteField,
  onClickAddAssociation,
  onClickEditAssociation,
  onClickDeleteAssociation,
}: ModelViewProps): React.ReactElement {
  return (
    <div className={classnames(padding('pt-2', 'px-6'), margin('mb-3'))}>
      <Breadcrumbs
        items={[{ label: `${titleCase(schema.name)} (schema)`, onClick: () => onViewSchema() }]}
        current={`${model && titleCase(model.name)} (model)`}
      />
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
                <FieldView
                  field={field}
                  onClickEdit={onClickEditField.bind(null, field)}
                  onClickDelete={onClickDeleteField.bind(null, field)}
                />
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
                onClickEdit={onClickEditAssociation.bind(null, association)}
                onClickDelete={onClickDeleteAssociation.bind(null, association)}
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
