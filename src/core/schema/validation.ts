import { MAX_IDENTIFIER_LENGTH } from '@src/core/database'
import {
  Association,
  associationsAreSame,
  associationsHaveSameForm,
  AssociationTypeType,
  Field,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { arrayToLookup } from '@src/utils/array'
import { deepEmpty } from '@src/utils/object'
import {
  nameEmpty,
  nameLongerThan,
  namesEq,
  namesEqSingular,
  nameStartsWithNumber,
} from '@src/utils/string'

// TODO: Unit tests

export type ModelErrors = {
  name?: string
  fields: { [id: string]: FieldErrors }
  associations: { [id: string]: AssociationErrors }
}

export type FieldErrors = {
  name?: string
}

export type AssociationErrors = {
  alias?: string
  foreignKey?: string
  targetForeignKey?: string
  throughTable?: string
}

export const emptyModelErrors: ModelErrors = {
  name: undefined,
  fields: {},
  associations: {},
}

export type SchemaErrors = {
  name?: string
}

export const emptySchemaErrors: SchemaErrors = {
  name: undefined,
}

export function validateSchema(schema: Schema, schemas: Schema[]): SchemaErrors {
  return {
    name: validateSchemaName(schema, schemas),
  }
}

export function noSchemaErrors(errors: SchemaErrors): boolean {
  return deepEmpty(errors)
}

function validateSchemaName(schema: Schema, schemas: Schema[]): string | undefined {
  if (nameEmpty(schema.name)) {
    return 'Schema name is required'
  }

  if (nameStartsWithNumber(schema.name)) {
    return 'Schema name cannot start with a number'
  }

  if (nameLongerThan(schema.name, MAX_IDENTIFIER_LENGTH)) {
    return 'Schema name cannot be longer than 63 characters'
  }

  if (findDuplicateSchema(schema, schemas)) {
    return 'Schema name must be unique'
  }
}

function findDuplicateSchema(schema: Schema, schemas: Schema[]): Schema | undefined {
  return schemas.find((s) => s.id !== schema.id && namesEqSingular(s.name, schema.name))
}

export function validateModel(model: Model, schema: Schema): ModelErrors {
  return {
    name: validateModelName(model, schema),
    fields: validateModelFields(model),
    associations: validateModelAssociations(model, schema),
  }
}

export function noModelErrors(errors: ModelErrors): boolean {
  return deepEmpty(errors)
}

function validateModelName(model: Model, schema: Schema): string | undefined {
  if (nameEmpty(model.name)) {
    return 'Model name is required'
  }

  if (nameLongerThan(model.name, MAX_IDENTIFIER_LENGTH)) {
    return 'Name cannot be longer than 63 characters'
  }

  if (nameStartsWithNumber(model.name)) {
    return 'Model name cannot start with a number'
  }

  if (findDuplicateModel(model, schema)) {
    return 'Model name must be unique in schema'
  }
}

function validateModelFields(model: Model): { [id: string]: FieldErrors } {
  return model.fields.reduce<{ [id: string]: FieldErrors }>((acc, field) => {
    acc[field.id] = validateField(field, model)
    return acc
  }, {})
}

function validateField(field: Field, model: Model): FieldErrors {
  return {
    name: validateFieldName(field, model),
  }
}

function validateFieldName(field: Field, model: Model): string | undefined {
  if (nameEmpty(field.name)) {
    return 'Field name is required'
  }

  if (nameLongerThan(field.name, MAX_IDENTIFIER_LENGTH)) {
    return 'Name cannot be longer than 63 characters'
  }

  if (nameStartsWithNumber(field.name)) {
    return 'Field name cannot start with a number'
  }

  if (findDuplicateField(field, model)) {
    return 'Field name must be unique in model'
  }
}

function validateModelAssociations(
  model: Model,
  schema: Schema,
): { [id: string]: AssociationErrors } {
  return model.associations.reduce<{ [id: string]: AssociationErrors }>((acc, association) => {
    acc[association.id] = validateAssociation(association, model, schema)
    return acc
  }, {})
}

function validateAssociation(
  association: Association,
  model: Model,
  schema: Schema,
): AssociationErrors {
  return {
    alias: validateAssociationAlias(association, model, schema),
    foreignKey: validateAssociationForeignKey(association),
    targetForeignKey: validateAssociationTargetForeignKey(association),
    throughTable: validateAssociationThroughTable(association),
  }
}

function validateAssociationAlias(
  association: Association,
  model: Model,
  schema: Schema,
): string | undefined {
  if (nameLongerThan(association.alias, MAX_IDENTIFIER_LENGTH)) {
    return 'Name cannot be longer than 63 characters'
  }

  if (nameStartsWithNumber(association.alias)) {
    return 'Alias cannot start with a number'
  }

  if (findDuplicateAlias(association, model)) {
    return `Alias must be unique across the model's associations`
  }

  if (findDuplicateAssociationName(association, model, schema)) {
    return 'Cannot have two associations to the same model/alias name'
  }
}

function validateAssociationForeignKey(association: Association): string | undefined {
  if (nameLongerThan(association.foreignKey, MAX_IDENTIFIER_LENGTH)) {
    return 'Name cannot be longer than 63 characters'
  }

  if (nameStartsWithNumber(association.foreignKey)) {
    return 'Foreign key cannot start with a number'
  }
}

function validateAssociationTargetForeignKey(association: Association): string | undefined {
  if (association.type.type === AssociationTypeType.ManyToMany) {
    if (nameLongerThan(association.type.targetFk, MAX_IDENTIFIER_LENGTH)) {
      return 'Name cannot be longer than 63 characters'
    }

    if (nameStartsWithNumber(association.type.targetFk)) {
      return 'Target foreign key cannot start with a number'
    }
  }
}

function validateAssociationThroughTable(association: Association): string | undefined {
  if (
    association.type.type === AssociationTypeType.ManyToMany &&
    association.type.through.type === ThroughType.ThroughTable
  ) {
    if (nameLongerThan(association.type.through.table, MAX_IDENTIFIER_LENGTH)) {
      return 'Name cannot be longer than 63 characters'
    }

    if (nameEmpty(association.type.through.table)) {
      return 'Through table is required'
    }

    if (nameStartsWithNumber(association.type.through.table)) {
      return 'Through table cannot start with a number'
    }
  }
}

function findDuplicateModel(model: Model, schema: Schema): Model | undefined {
  return schema.models.find((m) => m.id !== model.id && namesEqSingular(m.name, model.name))
}

function findDuplicateField(field: Field, model: Model): Field | undefined {
  return model.fields.find((f) => f.id !== field.id && namesEq(f.name, field.name))
}

function findDuplicateAlias(association: Association, model: Model): Association | undefined {
  return model.associations.find(
    (a) =>
      association.alias &&
      association.id !== a.id &&
      namesEq(a.alias, association.alias) &&
      associationsHaveSameForm(association, a),
  )
}

function findDuplicateAssociationName(
  association: Association,
  model: Model,
  schema: Schema,
): Association | undefined {
  const modelById = arrayToLookup(schema.models, (m) => m.id)
  const targetModel: Model | undefined = modelById.get(association.targetModelId)
  if (!targetModel) return undefined

  return model.associations.find((a) => {
    if (a.id === association.id) return false
    const aTargetModel: Model | undefined = modelById.get(a.targetModelId)
    if (!aTargetModel) return false

    return associationsAreSame({
      associationA: association,
      targetNameA: targetModel.name,
      associationB: a,
      targetNameB: aTargetModel.name,
    })
  })
}
