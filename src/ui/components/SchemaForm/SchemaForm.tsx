import { emptyModel, Model, Schema } from '@src/core/schema'
import { SchemaErrors } from '@src/core/validation/schema'
import usePrevious from '@src/ui/hooks/usePrevious'
import {
  alignSelf,
  backgroundColor,
  classnames,
  display,
  height,
  overflow,
  padding,
  toClassname,
  width,
} from '@src/ui/styles/classnames'
import { panel, panelGrid, sectionWide, subtitle, title } from '@src/ui/styles/utils'
import { focusById } from '@src/utils/dom'
import React from 'react'
import IconButton from '../form/IconButton'
import PanelButton from '../form/PanelButton'
import { autofillDisable } from '../form/shared/utils'
import TextInput from '../form/TextInput'
import PlusCircleIcon from '../icons/Plus'
import TrashIcon from '../icons/Trash'

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
      className={classnames(
        overflow('overflow-y-scroll'),
        height('h-full'),
        padding('p-2', 'xs:p-4', 'sm:p-6', 'pt-11'),
      )}
      {...autofillDisable}
    >
      <div className={classnames(sectionWide)}>
        <h2 className={classnames(title)}>Schema</h2>
        <div className={classnames(width('sm:w-1/2'))}>
          <TextInput
            id={schemaNameId()}
            label="Name"
            value={schema.name}
            error={errors.name}
            fixedErrorContainer
            onChange={handleChangeName}
          />
        </div>
      </div>
      <div className={classnames(sectionWide)}>
        <h3 className={classnames(subtitle)}>Models</h3>
        <ul className={classnames(panelGrid)}>
          {schema.models.map((m) => (
            <li key={m.id} className={classnames(panel, display('flex'), padding('p-1', 'pl-4'))}>
              <TextInput
                id={modelNameId(m)}
                className={classnames(padding('pt-4'))}
                label="Name"
                error={errors.models[m.id]?.name}
                fixedErrorContainer
                value={m.name}
                onChange={(value) => handleChangeModelName(m.id, value)}
              />

              <IconButton
                className={classnames(alignSelf('self-start'))}
                label="delete modal"
                icon={TrashIcon}
                iconProps={{ size: 6 }}
                onClick={() => handleDeleteModel(m.id)}
              />
            </li>
          ))}
          <li>
            <PanelButton
              id={createNewModelId()}
              className={classnames(
                backgroundColor(
                  backgroundColor('hover:bg-green-50', toClassname('dark:hover:bg-green-900')),
                ),
              )}
              label="Create a new model"
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={handleClickAddModel}
            />
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
