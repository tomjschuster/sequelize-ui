import {
  Association,
  AssociationType,
  DataType,
  Field,
  Model,
  Schema,
  arrayDataType,
  association,
  belongsToType,
  blobDataType,
  booleanDataType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  doubleDataType,
  field,
  floatDataType,
  hasManyType,
  hasOneType,
  integerDataType,
  jsonDataType,
  manyToManyTableType,
  model,
  realDataType,
  schema,
  stringDataType,
  textDataType,
  uuidDataType,
} from '@src/core/schema'
import {
  Association as AssociationV0,
  FieldType,
  Field as FieldV0,
  Model as ModelV0,
  SchemaV0,
} from '.'

export function fromV0(schemaV0: SchemaV0): Schema {
  return schema({
    name: schemaV0.config.name,
    models: schemaV0.models.map(fromV0Model),
  })
}

function fromV0Model(modelV0: ModelV0): Model {
  return model({
    id: modelV0.id,
    name: modelV0.name,
    fields: modelV0.fields.map(fromV0Field),
    associations: modelV0.assocs.map(fromV0Association),
  })
}

function fromV0Field(fieldV0: FieldV0): Field {
  return field({
    id: fieldV0.id,
    name: fieldV0.name,
    type: fromV0DataType(fieldV0),
    primaryKey: fieldV0.primaryKey,
    required: fieldV0.required,
    unique: fieldV0.unique,
  })
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

function fromV0Association(associationV0: AssociationV0): Association {
  return association({
    id: associationV0.id,
    type: fromV0AssociationType(associationV0),
    sourceModelId: associationV0.sourceId,
    targetModelId: associationV0.targetId,
    foreignKey: associationV0.foreignKey || null,
    alias: associationV0.name || null,
  })
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
