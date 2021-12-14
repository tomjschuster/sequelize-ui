import { emptyModel, Model, Schema } from '@src/core/schema'
import { SchemaErrors } from '@src/core/validation/schema'
import usePrevious from '@src/ui/hooks/usePrevious'
import { classnames } from '@src/ui/styles/classnames'
import {
  flexCenter,
  largeTitle,
  panel,
  panelAction,
  panelGrid,
  section,
} from '@src/ui/styles/utils'
import { focusById } from '@src/utils/dom'
import React from 'react'
import IconButton from '../form/IconButton'
import TextInput from '../form/TextInput'
import PlusCircleIcon from '../icons/Plus'
import TrashIcon from '../icons/Trash'

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
      <div className={classnames(section)}>
        <h2 className={classnames(largeTitle)}>Schema</h2>
        <div className={classnames('sm:w-1/2')}>
          <TextInput
            id={schemaNameId()}
            label="Name"
            value={schema.name}
            error={errors.name}
            onChange={handleChangeName}
          />
        </div>
      </div>
      <div className={classnames(section)}>
        <h3 className={classnames(subtitle)}>Models</h3>
        <ul className={classnames(panelGrid)}>
          {schema.models.map((m) => (
            <li key={m.id} className={classnames(panel, 'flex', 'p-1', 'pl-4')}>
              <TextInput
                id={modelNameId(m)}
                className={classnames('pt-4')}
                label="Name"
                error={errors.models[m.id]?.name}
                value={m.name}
                onChange={(value) => handleChangeModelName(m.id, value)}
              />

              <IconButton
                label="delete modal"
                icon={TrashIcon}
                iconProps={{ size: 6 }}
                onClick={() => handleDeleteModel(m.id)}
              />
            </li>
          ))}
          <li className={classnames(panelAction, 'hover:bg-green-50')}>
            <button
              id={createNewModelId()}
              className={classnames(flexCenter, 'p-1.5', 'flex-1')}
              onClick={handleClickAddModel}
            >
              <span className={classnames('mr-2')}>
                <PlusCircleIcon title="add model" size={6} />
              </span>
              Create a new model
            </button>
          </li>
        </ul>
      </div>
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
