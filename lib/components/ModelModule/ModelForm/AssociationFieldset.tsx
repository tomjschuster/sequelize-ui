import Radio from '@lib/components/form/Radio'
import Select from '@lib/components/form/Select'
import TextInput from '@lib/components/form/TextInput'
import {
  Association,
  AssociationType,
  changeAssociationType,
  displayAssociationType,
  displayThroughType,
  ManyToManyThrough,
  Model,
  Schema,
  ThroughType,
} from '@lib/core'
import { snakeCase } from '@lib/utils'
import React from 'react'

type AssociationFieldsetProps = {
  association: Association
  schema: Schema
  onChange: (id: Association['id'], changes: Association) => void
}

function AssociationFieldset({
  association,
  schema,
  onChange,
}: AssociationFieldsetProps): React.ReactElement {
  const modelOptions = React.useMemo(
    () => schema.models.map<[string, Model]>((m) => [m.id, m]),
    [schema.models],
  )

  const model = schema.models.find((m) => m.id === association.sourceModelId) as Model
  const targetModel = schema.models.find((m) => m.id === association.targetModelId) as Model

  const handleChangeType = (type: AssociationType) => {
    const change =
      type === AssociationType.ManyToMany
        ? { type, table: snakeCase(`${model.name} ${targetModel.name}`) }
        : { type }

    onChange(association.id, changeAssociationType(association, change))
  }

  const handleChangeTarget = (model: Model) =>
    onChange(association.id, { ...association, targetModelId: model.id })

  const handleChangeAlias = (alias: string) =>
    onChange(association.id, { ...association, alias: alias || undefined })

  const handleChangeForeignKey = (foreignKey: string) =>
    onChange(association.id, {
      ...association,
      foreignKey: foreignKey || undefined,
    })

  const handleChangeThroughType = (type: ThroughType) => {
    const table = snakeCase(`${model.name} ${targetModel.name}`)

    const throughModel =
      schema.models.find((m) => snakeCase(m.name) === table) || (schema.models[0] as Model)

    const through: ManyToManyThrough =
      type === ThroughType.ThroughModel ? { type, modelId: throughModel.id } : { type, table }
    onChange(association.id, {
      ...association,
      type: AssociationType.ManyToMany,
      through,
    })
  }

  const throughModel = schema.models.find(
    (m) =>
      association.type === AssociationType.ManyToMany &&
      association.through.type === ThroughType.ThroughModel &&
      m.id === association.through.modelId,
  )

  const handleChangeThroughModel = (model: Model) =>
    onChange(association.id, {
      ...association,
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: model.id },
    })

  const handleChangeThroughTable = (table: string) =>
    onChange(association.id, {
      ...association,
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughTable, table },
    })

  const handleChangeTargetForeignKey = (targetFk: string) =>
    association.type === AssociationType.ManyToMany &&
    onChange(association.id, { ...association, targetFk: targetFk || undefined })

  return (
    <fieldset>
      <Select
        id="association-type"
        label="Type"
        options={AssociationType}
        display={displayAssociationType}
        value={association.type}
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
        onChange={handleChangeAlias}
      />
      <TextInput
        id="association-fk"
        label="Foreign key"
        value={association.foreignKey || ''}
        onChange={handleChangeForeignKey}
      />
      {association.type === AssociationType.ManyToMany && schema.models.length > 0 && (
        <>
          <Radio
            options={ThroughType}
            value={association.through.type}
            display={displayThroughType}
            onChange={handleChangeThroughType}
          />
          {association.through.type === ThroughType.ThroughModel && (
            <Select
              id="association-through-model"
              label="Through model"
              options={modelOptions}
              display={modelName}
              value={throughModel}
              onChange={handleChangeThroughModel}
            />
          )}
          {association.through.type === ThroughType.ThroughTable && (
            <TextInput
              id="association-through-table"
              label="Through table"
              value={association.through.table}
              onChange={handleChangeThroughTable}
            />
          )}
          <TextInput
            id="association-target-fk"
            label="Target foreign key"
            value={association.targetFk || ''}
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

export default React.memo(AssociationFieldset)
