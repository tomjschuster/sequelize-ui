import {
  arrayDataType,
  Association,
  AssociationType,
  belongsToType,
  blobDataType,
  booleanDataType,
  DataType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  doubleDataType,
  Field,
  floatDataType,
  hasManyType,
  hasOneType,
  integerDataType,
  jsonDataType,
  manyToManyTableType,
  Model,
  realDataType,
  Schema,
  stringDataType,
  textDataType,
  uuidDataType,
} from '@src/core/schema'
import { now } from '@src/utils/dateTime'
import shortid from 'shortid'
import {
  Association as AssociationV0,
  Field as FieldV0,
  FieldType,
  Model as ModelV0,
  SchemaV0,
} from '.'

export function fromV0(schema: SchemaV0): Schema {
  return {
    id: shortid(),
    name: schema.config.name,
    createdAt: now(),
    updatedAt: now(),
    forkedFrom: null,
    models: schema.models.map(fromV0Model),
  }
}

function fromV0Model(model: ModelV0): Model {
  return {
    id: model.id,
    name: model.name,
    fields: model.fields.map(fromV0Field),
    associations: model.assocs.map(fromV0Association),
    createdAt: now(),
    updatedAt: now(),
  }
}

function fromV0Field(field: FieldV0): Field {
  return {
    id: field.id,
    name: field.name,
    type: fromV0DataType(field),
    primaryKey: field.primaryKey,
    required: field.required,
    unique: field.unique,
  }
}

function fromV0DataType(field: FieldV0): DataType {
  switch (field.type) {
    case FieldType.Array:
      return arrayDataType()
    case FieldType.Blob:
      return blobDataType()
    case FieldType.Boolean:
      return booleanDataType()
    case FieldType.Date:
      return dateTimeDataType()
    case FieldType.Dateonly:
      return dateDataType()
    case FieldType.Decimal:
      return decimalDataType()
    case FieldType.Double:
      return doubleDataType()
    case FieldType.Float:
      return floatDataType()
    case FieldType.Integer:
      return integerDataType()
    case FieldType.Json:
      return jsonDataType()
    case FieldType.Real:
      return realDataType()
    case FieldType.String:
      return stringDataType()
    case FieldType.Text:
      return textDataType()
    case FieldType.Uuid:
      return uuidDataType()
  }
}

function fromV0Association(association: AssociationV0): Association {
  return {
    id: association.id,
    type: fromV0AssociationType(association),
    sourceModelId: association.sourceId,
    targetModelId: association.targetId,
    foreignKey: association.foreignKey || null,
    alias: association.name || null,
  }
}

function fromV0AssociationType(association: AssociationV0): AssociationType {
  switch (association.type) {
    case 'BELONGS_TO':
      return belongsToType()
    case 'HAS_ONE':
      return hasOneType()
    case 'HAS_MANY':
      return hasManyType()
    case 'MANY_TO_MANY':
      return manyToManyTableType(association.through, association.targetForeignKey)
  }
}
