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
  return (
    <fieldset>
      <Select
        id="association-type"
        label="Type"
        options={AssociationType}
        display={displayAssociationType}
        value={association.type}
        onChange={(type) => {
          const change =
            type === AssociationType.ManyToMany
              ? { type, table: snakeCase(`${model.name} ${targetModel.name}`) }
              : { type }

          onChange(association.id, changeAssociationType(association, change))
        }}
      />
      <Select
        id="association-target-model"
        label="Target model"
        options={modelOptions}
        display={modelName}
        value={targetModel}
        onChange={(model) => onChange(association.id, { ...association, targetModelId: model.id })}
      />
      <TextInput
        id="association-alias"
        label="as"
        value={association.alias || ''}
        onChange={(alias: string) =>
          onChange(association.id, { ...association, alias: alias ? alias : undefined })
        }
      />
      <TextInput
        id="association-fk"
        label="Foreign key"
        value={association.foreignKey || ''}
        onChange={(foreignKey: string) =>
          onChange(association.id, {
            ...association,
            foreignKey: foreignKey ? foreignKey : undefined,
          })
        }
      />
      {association.type === AssociationType.ManyToMany && schema.models.length > 0 && (
        <>
          <Radio
            options={ThroughType}
            value={association.through.type}
            display={displayThroughType}
            onChange={(type) => {
              const table = snakeCase(`${model.name} ${targetModel.name}`)
              const throughModel =
                schema.models.find((m) => snakeCase(m.name) === table) ||
                (schema.models[0] as Model)
              const through: ManyToManyThrough =
                type === ThroughType.ThroughModel
                  ? { type, modelId: throughModel.id }
                  : { type, table }
              onChange(association.id, {
                ...association,
                type: AssociationType.ManyToMany,
                through,
              })
            }}
          />
          {association.through.type === ThroughType.ThroughModel && (
            <Select
              id="association-through-model"
              label="Through model"
              options={modelOptions}
              display={modelName}
              value={
                schema.models.find(
                  (m) =>
                    association.through.type === ThroughType.ThroughModel &&
                    m.id === association.through.modelId,
                ) as Model
              }
              onChange={(model) =>
                onChange(association.id, {
                  ...association,
                  through: { type: ThroughType.ThroughModel, modelId: model.id },
                })
              }
            />
          )}
          {association.through.type === ThroughType.ThroughTable && (
            <TextInput
              id="association-through-table"
              label="Through table"
              value={association.through.table}
              onChange={(table) =>
                association.through.type === ThroughType.ThroughTable &&
                onChange(association.id, {
                  ...association,
                  through: { ...association.through, table },
                })
              }
            />
          )}
          <TextInput
            id="association-target-fk"
            label="Target foreign key"
            value={association.targetFk || ''}
            onChange={(targetFk) =>
              onChange(association.id, { ...association, through: association.through, targetFk })
            }
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
