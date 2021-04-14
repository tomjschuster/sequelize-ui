import { Association, AssociationTypeType, Field, Model, Schema, ThroughType } from '@lib/core'

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

function validateModelName(model: Model, _schema: Schema): string | undefined {
  if (!model.name.trim()) {
    return 'Name is required'
  }

  if (/^([^A-Za-z])*\d/.test(model.name.trim())) {
    return 'Name cannot start with a number'
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

function validateFieldName(field: Field, _model: Model): string | undefined {
  if (!field.name.trim()) {
    return 'Name is required'
  }

  if (/^([^A-Za-z])*\d/.test(field.name.trim())) {
    return 'Name cannot start with a number'
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
    foreignKey: validateAssociationForeignKey(association, model),
    targetForeignKey: validateAssociationTargetForeignKey(association, model),
    throughTable: validateAssociationThroughTable(association, model),
  }
}

function validateAssociationAlias(association: Association, _model: Model): string | undefined {
  if (association.alias && /^([^A-Za-z])*\d/.test(association.alias.trim())) {
    return 'Alias cannot start with a number'
  }
}

function validateAssociationForeignKey(
  association: Association,
  _model: Model,
): string | undefined {
  if (association.foreignKey && /^([^A-Za-z])*\d/.test(association.foreignKey.trim())) {
    return 'Foreign key cannot start with a number'
  }
}

function validateAssociationTargetForeignKey(
  association: Association,
  _model: Model,
): string | undefined {
  if (
    association.type.type === AssociationTypeType.ManyToMany &&
    association.type.targetFk &&
    /^([^A-Za-z])*\d/.test(association.type.targetFk.trim())
  ) {
    return 'Target foreign key cannot start with a number'
  }
}

function validateAssociationThroughTable(
  association: Association,
  _model: Model,
): string | undefined {
  if (
    association.type.type === AssociationTypeType.ManyToMany &&
    association.type.through.type === ThroughType.ThroughTable
  ) {
    if (!association.type.through.table.trim()) {
      return 'Through table is required'
    }

    if (
      association.type.through.table &&
      /^([^A-Za-z])*\d/.test(association.type.through.table.trim())
    ) {
      return 'Through table cannot start with a number'
    }
  }
}

function deepEmpty(x: { [key: string]: unknown } | unknown[]): boolean {
  return Object.values(x).reduce<boolean>((acc, v) => {
    if (!acc) return acc
    if (typeof v === 'string') return !v.trim()
    if (Array.isArray(v)) return v.every(deepEmpty)
    if (typeof v === 'object' && v !== null) return deepEmpty(Object.values(v))
    return v === null || v === undefined || v == false
  }, true)
}
