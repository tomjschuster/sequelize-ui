import {
  Association,
  AssociationTypeType,
  displayAssociationTypeType,
  displayThroughType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import Radio from '@src/ui/components/form/Radio'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import { snakeCase } from '@src/utils/string'
import React, { useCallback, useMemo } from 'react'
import { AssociationFormErrors } from './validation'

type AssociationFieldsetProps = {
  association: Association
  schema: Schema
  model: Model
  errors?: AssociationFormErrors
  onChange: (id: Association['id'], changes: Partial<Association>) => void
  onDelete: (id: Association['id']) => void
}

function AssociationFieldset({
  association,
  schema,
  model,
  errors,
  onChange,
  onDelete,
}: AssociationFieldsetProps): React.ReactElement {
  const modelOptions = React.useMemo(
    () => schema.models.map<[string, Model]>((m) => [m.id, m]),
    [schema.models],
  )

  const targetModel: Model = useMemo(
    () => schema.models.find((m) => m.id === association.targetModelId) as Model,
    [schema.models, association.targetModelId],
  )

  const throughModel: Model | undefined = useMemo(
    () =>
      schema.models.find(
        (m) =>
          association.type.type === AssociationTypeType.ManyToMany &&
          association.type.through.type === ThroughType.ThroughModel &&
          m.id === association.type.through.modelId,
      ),
    [schema.models, association.type],
  )

  const handleChange = useCallback(
    (changes: Partial<Association>): void => {
      onChange(association.id, changes)
    },
    [association.id, onChange],
  )

  const handleChangeManyToMany = useCallback(
    (changes: Partial<ManyToManyAssociation>) => {
      if (association.type.type !== AssociationTypeType.ManyToMany) return
      handleChange({ type: { ...association.type, ...changes } })
    },
    [association.type, handleChange],
  )

  const handleChangeType = useCallback(
    (typeType: AssociationTypeType) => {
      if (typeType === AssociationTypeType.ManyToMany) {
        handleChange({
          type: {
            type: typeType,
            through: {
              type: ThroughType.ThroughTable,
              table: snakeCase(`${model.name} ${targetModel.name}`),
            },
          },
        })
        return
      }

      handleChange({ type: { type: typeType } })
    },
    [model.name, targetModel.name, handleChange],
  )

  const handleChangeTarget = useCallback(
    (model: Model) => handleChange({ targetModelId: model.id }),
    [handleChange],
  )

  const handleChangeAlias = useCallback(
    (alias?: string) => handleChange({ alias: alias || undefined }),
    [handleChange],
  )

  const handleChangeForeignKey = useCallback(
    (foreignKey?: string) => handleChange({ foreignKey: foreignKey || undefined }),
    [handleChange],
  )

  const handleChangeThroughType = useCallback(
    (type: ThroughType) => {
      const associationType = association.type
      if (associationType.type !== AssociationTypeType.ManyToMany) {
        return
      }

      const table = snakeCase(`${model.name} ${targetModel.name}`)

      if (type === ThroughType.ThroughTable) {
        handleChangeManyToMany({ through: { type, table } })
        return
      }

      const throughModel =
        schema.models.find((m) => snakeCase(m.name) === table) || schema.models[0]

      if (throughModel) {
        handleChangeManyToMany({ through: { type, modelId: throughModel.id } })
      }
    },
    [association.type, model.name, targetModel, schema.models, handleChangeManyToMany],
  )

  const handleChangeThroughModel = useCallback(
    (model: Model) => {
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughModel, modelId: model.id },
      })
    },
    [handleChangeManyToMany],
  )

  const handleChangeThroughTable = useCallback(
    (table?: string) =>
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughTable, table: table || '' },
      }),
    [handleChangeManyToMany],
  )

  const handleChangeTargetForeignKey = useCallback(
    (targetFk?: string) => handleChangeManyToMany({ targetFk: targetFk || undefined }),
    [handleChangeManyToMany],
  )

  const handleDelete = useCallback(() => onDelete(association.id), [onDelete, association.id])

  return (
    <fieldset>
      <Select
        id="association-type"
        label="Type"
        options={AssociationTypeType}
        display={displayAssociationTypeType}
        value={association.type.type}
        onChange={handleChangeType}
      />
      <Select
        id="association-target-model"
        label="Target model"
        options={modelOptions}
        display={modelName}
        value={targetModel}
        onChange={handleChangeTarget}
      />
      <TextInput
        id="association-alias"
        label="as"
        value={association.alias || ''}
        error={errors?.alias}
        onChange={handleChangeAlias}
      />
      <TextInput
        id="association-fk"
        label="Foreign key"
        value={association.foreignKey || ''}
        error={errors?.foreignKey}
        onChange={handleChangeForeignKey}
      />
      {association.type.type === AssociationTypeType.ManyToMany && schema.models.length > 0 && (
        <>
          <Radio
            options={ThroughType}
            value={association.type.through.type}
            display={displayThroughType}
            onChange={handleChangeThroughType}
          />
          {association.type.through.type === ThroughType.ThroughModel && (
            <Select
              id="association-through-model"
              label="Through model"
              options={modelOptions}
              display={modelName}
              value={throughModel}
              onChange={handleChangeThroughModel}
            />
          )}
          {association.type.through.type === ThroughType.ThroughTable && (
            <>
              <TextInput
                id="association-through-table"
                label="Through table"
                value={association.type.through.table}
                error={errors?.throughTable}
                onChange={handleChangeThroughTable}
              />
            </>
          )}
          <TextInput
            id="association-target-fk"
            label="Target foreign key"
            value={association.type.targetFk || ''}
            error={errors?.targetForeignKey}
            onChange={handleChangeTargetForeignKey}
          />
        </>
      )}
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </fieldset>
  )
}

function modelName(model: Model): string {
  return model.name
}

export default React.memo(AssociationFieldset)
