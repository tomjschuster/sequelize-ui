import {
  Association,
  AssociationTypeType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
  associationTypeIsSingular,
  belongsToType,
  throughModel as buildThroughModel,
  displayAssociationTypeType,
  displayThroughType,
  hasManyType,
  hasOneType,
  isManytoMany,
  isThroughModel,
  isThroughTable,
  manyToManyTableType,
  throughTable,
} from '@src/core/schema'
import { AssociationErrors } from '@src/core/validation/schema'
import Radio from '@src/ui/components/form/Radio'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import { classnames, gridColumn, inset, margin, padding, position } from '@src/ui/styles/classnames'
import { fieldsetGrid } from '@src/ui/styles/utils'
import { plural, singular, snakeCase } from '@src/utils/string'
import React from 'react'
import IconButton from '../form/IconButton'
import TrashIcon from '../icons/Trash'

type AssociationFieldsetProps = {
  association: Association
  schema: Schema
  model: Model
  errors?: AssociationErrors
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

  const targetModel: Model = React.useMemo(
    () => schema.models.find((m) => m.id === association.targetModelId) as Model,
    [schema.models, association.targetModelId],
  )

  const throughModel: Model | undefined = React.useMemo(
    () =>
      schema.models.find(
        (m) =>
          isManytoMany(association) &&
          isThroughModel(association.type.through) &&
          m.id === association.type.through.modelId,
      ),
    [schema.models, association],
  )

  const handleChange = React.useCallback(
    (changes: Partial<Association>): void => {
      onChange(association.id, changes)
    },
    [association.id, onChange],
  )

  const handleChangeManyToMany = React.useCallback(
    (changes: Partial<ManyToManyAssociation>) => {
      if (!isManytoMany(association)) return
      handleChange({ type: { ...association.type, ...changes } })
    },
    [association, handleChange],
  )

  const handleChangeType = React.useCallback(
    (typeType: AssociationTypeType) => {
      switch (typeType) {
        case AssociationTypeType.BelongsTo:
          handleChange({ type: belongsToType() })
          return

        case AssociationTypeType.HasOne:
          handleChange({ type: hasOneType() })
          return

        case AssociationTypeType.HasMany:
          handleChange({ type: hasManyType() })
          return

        case AssociationTypeType.ManyToMany: {
          const table_name = defaultThroughTableName(model.name, targetModel.name)
          handleChange({ type: manyToManyTableType(table_name) })
          return
        }
      }
    },
    [model.name, targetModel?.name, handleChange],
  )

  const handleChangeTarget = React.useCallback(
    (newTargetModel: Model) => {
      if (
        isManytoMany(association) &&
        isThroughTable(association.type.through) &&
        snakeCase(association.type.through.table) ==
          defaultThroughTableName(model.name, targetModel.name)
      ) {
        handleChange({
          targetModelId: newTargetModel.id,
          type: {
            ...association.type,
            through: throughTable(defaultThroughTableName(model.name, newTargetModel.name)),
          },
        })
      } else {
        handleChange({ targetModelId: newTargetModel.id })
      }
    },
    [handleChange, association, targetModel, model],
  )

  const handleChangeAlias = React.useCallback(
    (alias?: string) => handleChange({ alias: alias || undefined }),
    [handleChange],
  )

  const handleChangeForeignKey = React.useCallback(
    (foreignKey?: string) => handleChange({ foreignKey: foreignKey || undefined }),
    [handleChange],
  )

  const handleChangeThroughType = React.useCallback(
    (type: ThroughType) => {
      if (!isManytoMany(association)) return

      const table = defaultThroughTableName(model.name, targetModel.name)

      if (type === ThroughType.ThroughTable) {
        handleChangeManyToMany({ through: throughTable(table) })
        return
      }

      const throughModel =
        schema.models.find((m) => snakeCase(m.name) === table) || schema.models[0]

      if (throughModel) {
        handleChangeManyToMany({ through: buildThroughModel(throughModel.id) })
      }
    },
    [association, model.name, targetModel, schema.models, handleChangeManyToMany],
  )

  const handleChangeThroughModel = React.useCallback(
    (model: Model) => {
      handleChangeManyToMany({
        through: buildThroughModel(model.id),
      })
    },
    [handleChangeManyToMany],
  )

  const handleChangeThroughTable = React.useCallback(
    (table?: string) =>
      handleChangeManyToMany({
        through: throughTable(table || ''),
      }),
    [handleChangeManyToMany],
  )

  const handleChangeTargetForeignKey = React.useCallback(
    (targetFk?: string) => handleChangeManyToMany({ targetFk: targetFk || undefined }),
    [handleChangeManyToMany],
  )

  const handleDelete = React.useCallback(() => onDelete(association.id), [onDelete, association.id])

  return (
    <fieldset className={classnames(fieldsetGrid, padding('pb-0'))}>
      <IconButton
        className={classnames(position('absolute'), inset('top-0', 'right-0'), padding('p-1'))}
        label="delete"
        icon={TrashIcon}
        iconProps={{ size: 6 }}
        onClick={handleDelete}
      />
      <Select
        id={associationTypeId(association)}
        className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
        label="Type"
        options={AssociationTypeType}
        display={displayAssociationTypeType}
        value={association.type.type}
        onChange={handleChangeType}
      />
      <Select
        id={`association-target-model-${association.id}`}
        className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
        label="Target model"
        options={modelOptions}
        display={modelName}
        value={targetModel}
        onChange={handleChangeTarget}
      />
      <TextInput
        id={`association-alias-${association.id}`}
        className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
        label="as"
        value={association.alias || ''}
        placeholder={aliasPlaceholder(association, targetModel)}
        error={errors?.alias}
        onChange={handleChangeAlias}
      />
      <TextInput
        id={`association-fk-${association.id}`}
        className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
        label="Foreign key"
        value={association.foreignKey || ''}
        error={errors?.foreignKey}
        onChange={handleChangeForeignKey}
      />
      {isManytoMany(association) && schema.models.length > 0 && (
        <>
          <Radio
            className={classnames(gridColumn('col-span-12'), margin('mb-2'))}
            options={ThroughType}
            value={association.type.through.type}
            display={displayThroughType}
            onChange={handleChangeThroughType}
          />
          {isThroughModel(association.type.through) && (
            <Select
              id={`association-through-model-${association.id}`}
              className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
              label="Through model"
              options={modelOptions}
              display={modelName}
              value={throughModel || null}
              onChange={handleChangeThroughModel}
            />
          )}
          {isThroughTable(association.type.through) && (
            <TextInput
              id={`association-through-table-${association.id}`}
              className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
              label="Through table"
              value={association.type.through.table}
              error={errors?.throughTable}
              fixedErrorContainer
              onChange={handleChangeThroughTable}
            />
          )}
          <TextInput
            id={`association-target-fk-${association.id}`}
            className={classnames(gridColumn('col-span-12', 'xs:col-span-6'), margin('mb-2'))}
            label="Target FK"
            value={association.type.targetFk || ''}
            error={errors?.targetForeignKey}
            fixedErrorContainer
            onChange={handleChangeTargetForeignKey}
          />
        </>
      )}
    </fieldset>
  )
}

function modelName(model: Model): string {
  return model.name
}

function aliasPlaceholder(association: Association, model: Model): string | undefined {
  return association.alias
    ? undefined
    : associationTypeIsSingular(association.type)
      ? singular(model.name)
      : plural(model.name)
}

function defaultThroughTableName(modelName: string, targetModelName: string): string {
  return snakeCase(`${modelName} ${targetModelName}`)
}

export function associationTypeId(association: Association): string {
  return `association-type-${association.id}`
}

export default React.memo(AssociationFieldset)
