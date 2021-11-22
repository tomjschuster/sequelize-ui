import { Model, Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { titleCase } from '@src/utils/string'
import React from 'react'
import SelectorIcon from '../icons/Selector'

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

export const section = classnames('max-w-screen-lg', 'p-6', 'pt-8', 'flex', 'flex-col', 'mx-auto')

export const title = classnames('text-2xl', 'mb-2')
export const subtitle = classnames('text-xl', 'mb-2')

type SchemaViewProps = {
  schema: Schema
  onClickModel: (model: Model) => void
}

function SchemaView({ schema, onClickModel }: SchemaViewProps): React.ReactElement {
  return (
    <div className={classnames(section)}>
      <h2 className={classnames(title)}>Schema</h2>
      <div className={classnames('mb-8')}>
        <p className={classnames('text-lg')}>Name: {titleCase(schema.name)}</p>
      </div>
      <h3 className={classnames(subtitle)}>Models</h3>
      <ul className={classnames(grid)}>
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
              'bg-white',
              'cursor-pointer',
              'hover:bg-gray-100',
            )}
            onClick={() => onClickModel(m)}
          >
            <span className={classnames('px-1.5', 'text-lg')}>{titleCase(m.name)}</span>
            <div className={classnames('flex', 'items-center')}>
              <button className={classnames('p-1.5')} onClick={() => onClickModel(m)}>
                <SelectorIcon title="select model" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default React.memo(SchemaView)
