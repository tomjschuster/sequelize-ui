import { Model, Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { flexCenterBetween, largeTitle, panel, panelGrid, section } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import IconButton from '../form/IconButton'
import PanelButton from '../form/PanelButton'
import PlusCircleIcon from '../icons/Plus'
import SelectorIcon from '../icons/Selector'

export const subtitle = classnames('text-xl', 'mb-2')

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
    <div className={classnames('p-6', 'pt-2')}>
      <div className={classnames('mb-4', 'flex', 'text-sm')}>
        <span>{titleCase(schema.name)} (schema)</span>
      </div>
      <div className={classnames(section)}>
        <h2 className={classnames(largeTitle)}>Schema</h2>
        <div className={classnames('mb-11')}>
          <p className={classnames('text-lg')}>Name: {titleCase(schema.name)}</p>
        </div>
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(subtitle)}>Models</h3>
        <ul className={classnames(panelGrid)}>
          {schema.models.map((m) => (
            <li key={m.id} className={classnames(panel, flexCenterBetween, 'px-2', 'py-3')}>
              <button
                tabIndex={-1}
                className={classnames('hover:underline', 'px-1.5', 'text-lg')}
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
              className={classnames('hover:bg-green-50')}
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
