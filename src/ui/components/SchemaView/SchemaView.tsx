import { Model, Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { largeTitle, panel, panelGrid, section } from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import IconButton from '../form/IconButton'
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
            <li
              key={m.id}
              className={classnames(
                panel,
                'flex',
                'justify-between',
                'items-center',
                'px-2',
                'py-3',
              )}
            >
              <button
                className={classnames('hover:underline', 'px-1.5', 'text-lg')}
                onClick={() => onClickModel(m)}
              >
                {titleCase(m.name)}
              </button>
              <IconButton
                label="select model"
                icon={SelectorIcon}
                iconProps={{ size: 6 }}
                onClick={() => onClickModel(m)}
              />
            </li>
          ))}
          <li
            className={classnames(
              panel,
              'flex',
              'items-stretch',
              'justify-center',
              'bg-white',
              'hover:bg-green-50',
              'text-lg',
              'border-dashed',
            )}
          >
            <button
              className={classnames('flex', 'items-center', 'justify-center', 'p-1.5', 'flex-1')}
              onClick={onClickAddModel}
            >
              <span className={classnames('mr-2')}>
                <PlusCircleIcon title="add model" size={6} />
              </span>
              Create a new model
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default React.memo(SchemaView)
