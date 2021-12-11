import {
  Association,
  associationTypeIsSingular,
  AssociationTypeType,
  displayAssociationTypeType,
  displayThroughType,
  isManytoMany,
  isThroughModel,
  isThroughTable,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { AssociationErrors } from '@src/core/validation/schema'
import Radio from '@src/ui/components/form/Radio'
import Select from '@src/ui/components/form/Select'
import TextInput from '@src/ui/components/form/TextInput'
import { classnames } from '@src/ui/styles/classnames'
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

  const handleChangeTarget = React.useCallback(
    (model: Model) => handleChange({ targetModelId: model.id }),
    [handleChange],
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
    [association, model.name, targetModel, schema.models, handleChangeManyToMany],
  )

  const handleChangeThroughModel = React.useCallback(
    (model: Model) => {
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughModel, modelId: model.id },
      })
    },
    [handleChangeManyToMany],
  )

  const handleChangeThroughTable = React.useCallback(
    (table?: string) =>
      handleChangeManyToMany({
        through: { type: ThroughType.ThroughTable, table: table || '' },
      }),
    [handleChangeManyToMany],
  )

  const handleChangeTargetForeignKey = React.useCallback(
    (targetFk?: string) => handleChangeManyToMany({ targetFk: targetFk || undefined }),
    [handleChangeManyToMany],
  )

  const handleDelete = React.useCallback(() => onDelete(association.id), [onDelete, association.id])

  return (
    <fieldset
      className={classnames(
        'p-4',
        'pt-8',
        'pb-0',
        'grid',
        'grid-cols-12',
        'gap-y-0',
        'gap-x-4',
        'relative',
      )}
    >
      <div className={classnames('col-span-6')}>
        <Select
          id={associationTypeId(association)}
          label="Type"
          options={AssociationTypeType}
          display={displayAssociationTypeType}
          value={association.type.type}
          onChange={handleChangeType}
        />
      </div>
      <div className={classnames('col-span-6')}>
        <Select
          id={`association-target-model-${association.id}`}
          label="Target model"
          options={modelOptions}
          display={modelName}
          value={targetModel}
          onChange={handleChangeTarget}
        />
      </div>
      <div className={classnames('col-span-6')}>
        <TextInput
          id={`association-alias-${association.id}`}
          label="as"
          value={association.alias || ''}
          placeholder={aliasPlaceholder(association, targetModel)}
          error={errors?.alias}
          onChange={handleChangeAlias}
        />
      </div>
      <div className={classnames('col-span-6')}>
        <TextInput
          id={`association-fk-${association.id}`}
          label="Foreign key"
          value={association.foreignKey || ''}
          error={errors?.foreignKey}
          onChange={handleChangeForeignKey}
        />
      </div>
      {!isManytoMany(association) && <div className={classnames('h-30')} />}
      {isManytoMany(association) && schema.models.length > 0 && (
        <>
          <div className={classnames('col-span-12', 'pb-5')}>
            <Radio
              options={ThroughType}
              value={association.type.through.type}
              display={displayThroughType}
              onChange={handleChangeThroughType}
            />
          </div>
          <div className={classnames('col-span-6')}>
            {isThroughModel(association.type.through) && (
              <Select
                id={`association-through-model-${association.id}`}
                label="Through model"
                options={modelOptions}
                display={modelName}
                value={throughModel}
                onChange={handleChangeThroughModel}
              />
            )}
            {isThroughTable(association.type.through) && (
              <>
                <TextInput
                  id={`association-through-table-${association.id}`}
                  label="Through table"
                  value={association.type.through.table}
                  error={errors?.throughTable}
                  onChange={handleChangeThroughTable}
                />
              </>
            )}
          </div>
          <div className={classnames('col-span-6')}>
            <TextInput
              id={`association-target-fk-${association.id}`}
              label="Target FK"
              value={association.type.targetFk || ''}
              error={errors?.targetForeignKey}
              onChange={handleChangeTargetForeignKey}
            />
          </div>
        </>
      )}
      <div className={classnames('absolute', 'top-0', 'right-0', 'p-1')}>
        <IconButton
          label="delete"
          icon={TrashIcon}
          iconProps={{ size: 6 }}
          onClick={handleDelete}
        />
      </div>
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

export function associationTypeId(association: Association): string {
  return `association-type-${association.id}`
}

export default React.memo(AssociationFieldset)
