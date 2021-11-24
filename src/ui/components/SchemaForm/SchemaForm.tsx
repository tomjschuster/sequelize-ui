import { emptyModel, Model, Schema } from '@src/core/schema'
import { SchemaErrors } from '@src/core/validation/schema'
import usePrevious from '@src/ui/hooks/usePrevious'
import { classnames } from '@src/ui/styles/classnames'
import { focusById } from '@src/utils/dom'
import React from 'react'
import TextInput from '../form/TextInput'
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

export const section = classnames('max-w-screen-lg', 'flex', 'flex-col', 'mx-auto')

export const title = classnames('text-2xl', 'mb-2')
export const subtitle = classnames('text-xl', 'mb-2')

type SchemaFormProps = {
  schema: Schema
  newModel?: boolean
  errors: SchemaErrors
  onChange: (schema: Schema) => void
}

function SchemaForm({ schema, newModel, errors, onChange }: SchemaFormProps): React.ReactElement {
  const prevSchema = usePrevious(schema)

  React.useEffect(() => {
    if (newModel) {
      handleClickAddModel()
      return
    }
    focusById(schemaNameId())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const newModel =
      prevSchema?.models &&
      schema.models.find((m) => !prevSchema.models.some((pm) => pm.id === m.id))

    if (newModel) {
      focusById(modelNameId(newModel))
    }
  }, [prevSchema?.models, schema.models])

  const handleChangeName = React.useCallback(
    (name: string | undefined) => onChange({ ...schema, name: name || '' }),
    [schema, onChange],
  )

  const handleChangeModelName = React.useCallback(
    (modelId: string, name: string | undefined) =>
      onChange({
        ...schema,
        models: schema.models.map((m) => (m.id === modelId ? { ...m, name: name || '' } : m)),
      }),

    [schema, onChange],
  )

  const handleClickAddModel = React.useCallback(
    () => onChange({ ...schema, models: [...schema.models, emptyModel()] }),
    [schema, onChange],
  )

  const handleDeleteModel = React.useCallback(
    (id: Model['id']) =>
      onChange({
        ...schema,
        models: schema.models.filter((m) => m.id !== id),
      }),
    [schema, onChange],
  )

  return (
    <form
      onSubmit={(evt) => evt.preventDefault()}
      autoComplete="off"
      data-lpignore="true"
      data-form-type="other"
      className={classnames('p-6', 'pt-11')}
    >
      <h2 className={classnames(title)}>Schema</h2>
      <div className={classnames('sm:w-1/2')}>
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
            className={classnames(panel, 'flex', 'items-stretch', 'bg-white', 'pr-1', 'pl-2')}
          >
            <TextInput
              id={modelNameId(m)}
              className={classnames('pt-3', 'pb-1')}
              label="Name"
              error={errors.models[m.id]?.name}
              value={m.name}
              onChange={(value) => handleChangeModelName(m.id, value)}
            />
            <button
              className={classnames('p-2', 'hover:bg-gray-200', 'self-center', 'ml-0.5')}
              onClick={() => handleDeleteModel(m.id)}
            >
              <TrashIcon title="delete model" />
            </button>
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
            id={createNewModelId()}
            className={classnames('flex', 'items-center', 'justify-center', 'p-1.5', 'flex-1')}
            onClick={handleClickAddModel}
          >
            <span className={classnames('mr-2')}>
              <PlusCircleIcon title="add model" />
            </span>
            Create a new model
          </button>
        </li>
      </ul>
    </form>
  )
}

function schemaNameId(): string {
  return 'schema-name'
}

function modelNameId(model: Model): string {
  return `model-name-${model.id}`
}

function createNewModelId(): string {
  return 'create-new-model'
}

export default SchemaForm
