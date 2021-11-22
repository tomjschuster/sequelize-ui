import { emptyModel, Model, Schema } from '@src/core/schema'
import { SchemaErrors } from '@src/core/validation/schema'
import usePrevious from '@src/ui/hooks/usePrevious'
import { classnames } from '@src/ui/styles/classnames'
import { focusById } from '@src/utils/dom'
import { titleCase } from '@src/utils/string'
import React from 'react'
import TextInput from '../form/TextInput'
import CloseIcon from '../icons/Close'
import PlusCircleIcon from '../icons/Plus'
import TrashIcon from '../icons/Trash'

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

export const section = classnames(
  'max-w-screen-lg',
  'p-6',
  'flex',
  'flex-col',
  'mx-auto',
  'mb-6',
  'last:mb-0',
)

export const title = classnames('text-2xl', 'mb-2')
export const subtitle = classnames('text-xl', 'mb-2')

type SchemaFormProps = {
  schema: Schema
  errors: SchemaErrors
  onChange: (schema: Schema) => void
}

function SchemaForm({ schema, errors, onChange }: SchemaFormProps): React.ReactElement {
  const [newModelName, setNewModelName] = React.useState<string | undefined>()
  const [newModelError, setNewModelError] = React.useState<string | undefined>()
  const prevNewModelName = usePrevious(newModelName)
  const prevSchema = usePrevious(schema)

  console.log('RENDERING')

  React.useEffect(() => {
    focusById(schemaNameId())
  }, [])

  React.useEffect(() => {
    if (prevNewModelName === undefined && newModelName !== undefined) {
      focusById(newModelNameId())
    }
  }, [newModelName, prevNewModelName])

  React.useEffect(() => {
    if (prevSchema && schema.models.length !== prevSchema.models.length) {
      focusById(createNewModelId())
    }
  }, [prevSchema, schema])

  const handleChangeName = React.useCallback(
    (name: string | undefined) => onChange({ ...schema, name: name || '' }),
    [schema, onChange],
  )

  const handleClickAddModel = React.useCallback(() => setNewModelName(''), [])

  const handleClickSubmitNewModel = React.useCallback(() => {
    if (newModelName) {
      onChange({ ...schema, models: [...schema.models, { ...emptyModel(), name: newModelName }] })
      setNewModelError(undefined)
      setNewModelName(undefined)
    } else {
      setNewModelError('required')
    }
  }, [schema, newModelName, onChange])

  const handleClickCancelNewModel = React.useCallback(() => {
    setNewModelError(undefined)
    setNewModelName(undefined)
  }, [])

  const handleDeleteModel = React.useCallback(
    (id: Model['id']) =>
      onChange({
        ...schema,
        models: schema.models.filter((m) => m.id !== id),
      }),
    [schema, onChange],
  )

  const handleNewModelKeyPress = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        handleClickSubmitNewModel()
      }
    },
    [handleClickSubmitNewModel],
  )

  return (
    <div className={classnames(section)}>
      <h2 className={classnames(title)}>Schema</h2>
      <div className={classnames('mb-4', 'sm:w-1/2')}>
        <TextInput
          id={schemaNameId()}
          label="Name"
          value={schema.name}
          error={errors.name}
          onChange={handleChangeName}
        />
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
              'p-2',
              'bg-white',
            )}
          >
            <span className={classnames('p-1.5', 'text-lg')}>{titleCase(m.name)}</span>
            <button
              className={classnames('p-1.5', 'hover:bg-gray-200')}
              onClick={() => handleDeleteModel(m.id)}
            >
              <TrashIcon title="delete model" />
            </button>
          </li>
        ))}
        {newModelName === undefined ? (
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
              id={createNewModelId()}
              className={classnames('flex', 'items-center', 'justify-center', 'p-1.5', 'flex-1')}
              onClick={handleClickAddModel}
            >
              <span className={classnames('mr-2')}>
                <PlusCircleIcon />
              </span>
              Create a new model
            </button>
          </li>
        ) : (
          <li className={classnames(panel, 'flex', 'items-stretch', 'bg-white', 'pr-1')}>
            <TextInput
              id={newModelNameId()}
              className={classnames('flex-1')}
              label="Name"
              large
              error={newModelError}
              value={newModelName}
              onChange={setNewModelName}
              onKeyPress={handleNewModelKeyPress}
            />
            <button
              id={createNewModelId()}
              className={classnames('p-2', 'hover:bg-gray-200', 'self-center', 'ml-0.5')}
              onClick={handleClickSubmitNewModel}
            >
              <PlusCircleIcon />
            </button>
            <button
              className={classnames('p-2', 'hover:bg-gray-200', 'self-center', 'ml-0.5')}
              onClick={handleClickCancelNewModel}
            >
              <CloseIcon />
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

function schemaNameId(): string {
  return 'schema-name'
}

function newModelNameId(): string {
  return 'new-model-name'
}

function createNewModelId(): string {
  return 'create-new-model'
}

export default SchemaForm
