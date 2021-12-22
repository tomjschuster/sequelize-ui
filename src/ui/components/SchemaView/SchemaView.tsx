import { Model, Schema } from '@src/core/schema'
import {
  backgroundColor,
  classnames,
  display,
  fontSize,
  margin,
  padding,
  textDecoration,
} from '@src/ui/styles/classnames'
import { flexCenterBetween, panel, panelGrid, section, subtitle, title } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import Breadcrumbs from '../Breadcrumbs'
import IconButton from '../form/IconButton'
import PanelButton from '../form/PanelButton'
import PlusCircleIcon from '../icons/Plus'
import SelectorIcon from '../icons/Selector'

type SchemaViewProps = {
  schema: Schema
  onClickModel: (model: Model) => void
  onClickAddModel: () => void
}

function SchemaView({
  schema,
  onClickModel,
  onClickAddModel,
}: SchemaViewProps): React.ReactElement {
  return (
    <div className={classnames(padding('p-6', 'pt-2'))}>
      <Breadcrumbs items={[]} current={`${titleCase(schema.name)} (schema)`} />
      <div className={classnames(margin('mb-4'), display('flex'), fontSize('text-sm'))}>
        <span>{titleCase(schema.name)} (schema)</span>
      </div>
      <div className={classnames(section)}>
        <h2 className={classnames(title)}>Schema</h2>
        <div className={classnames(margin('mb-11'))}>
          <p className={classnames(fontSize('text-lg'))}>Name: {titleCase(schema.name)}</p>
        </div>
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(subtitle)}>Models</h3>
        <ul className={classnames(panelGrid)}>
          {schema.models.map((m) => (
            <li
              key={m.id}
              className={classnames(panel, flexCenterBetween, padding('px-2', 'py-3'))}
            >
              <button
                tabIndex={-1}
                className={classnames(
                  textDecoration('hover:underline'),
                  padding('px-1.5'),
                  fontSize('text-lg'),
                )}
                onClick={() => onClickModel(m)}
              >
                {titleCase(m.name)}
              </button>
              <IconButton
                label={`select ${m.name} model`}
                icon={SelectorIcon}
                iconProps={{ size: 6 }}
                onClick={() => onClickModel(m)}
              />
            </li>
          ))}
          <li>
            <PanelButton
              className={classnames(backgroundColor('hover:bg-green-50'))}
              label="Create a new model"
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={onClickAddModel}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default React.memo(SchemaView)
