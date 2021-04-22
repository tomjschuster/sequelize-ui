import {
  Association,
  associationsHaveSameForm,
  AssociationTypeType,
  Field,
  MAX_IDENTIFIER_LENGTH,
  Model,
  Schema,
  ThroughType,
} from '@lib/core'
import {
  deepEmpty,
  nameEmpty,
  nameLongerThan,
  namesEq,
  namesEqSingular,
  nameStartsWithNumber,
} from '@lib/core/utils'

export type ModelFormErrors = {
  name?: string
  fields: { [id: string]: FieldFormErrors }
  associations: { [id: string]: AssociationFormErrors }
}

export type FieldFormErrors = {
  name?: string
}

export type AssociationFormErrors = {
  alias?: string
  foreignKey?: string
  targetForeignKey?: string
  throughTable?: string
}

export const emptyErrors: ModelFormErrors = {
  name: undefined,
  fields: {},
  associations: {},
}

export function validateModel(model: Model, schema: Schema): ModelFormErrors {
  return {
    name: validateModelName(model, schema),
    fields: validateModelFields(model),
    associations: validateModelAssociations(model),
  }
}

export function noModelFormErrors(errors: ModelFormErrors): boolean {
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

function validateModelFields(model: Model): { [id: string]: FieldFormErrors } {
  return model.fields.reduce<{ [id: string]: FieldFormErrors }>((acc, field) => {
    acc[field.id] = validateField(field, model)
    return acc
  }, {})
}

function validateField(field: Field, model: Model): FieldFormErrors {
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

function validateModelAssociations(model: Model): { [id: string]: AssociationFormErrors } {
  return model.associations.reduce<{ [id: string]: AssociationFormErrors }>((acc, association) => {
    acc[association.id] = validateAssociation(association, model)
    return acc
  }, {})
}

function validateAssociation(association: Association, model: Model): AssociationFormErrors {
  return {
    alias: validateAssociationAlias(association, model),
    foreignKey: validateAssociationForeignKey(association),
    targetForeignKey: validateAssociationTargetForeignKey(association),
    throughTable: validateAssociationThroughTable(association),
  }
}

function validateAssociationAlias(association: Association, model: Model): string | undefined {
  if (nameLongerThan(association.alias, MAX_IDENTIFIER_LENGTH)) {
    return 'Name cannot be longer than 63 characters'
  }

  if (nameStartsWithNumber(association.alias)) {
    return 'Alias cannot start with a number'
  }

  if (findDuplicateAlias(association, model)) {
    return `Alias must be unique across the model's associations`
  }

  if (findDuplicateTarget(association, model)) {
    return 'Cannot have two associations of the same type to the same model without an alias'
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

function findDuplicateTarget(association: Association, model: Model): Association | undefined {
  return model.associations.find(
    (a) =>
      !association.alias &&
      !a.alias &&
      association.id !== a.id &&
      association.targetModelId === a.targetModelId &&
      associationsHaveSameForm(association, a),
  )
}
