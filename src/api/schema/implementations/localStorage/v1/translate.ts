import {
  Association,
  AssociationType,
  belongsToType,
  DataType,
  DataTypeType,
  Field,
  hasManyType,
  hasOneType,
  manyToManyModelType,
  manyToManyTableType,
  Model,
  Schema,
  UuidType,
} from '@src/core/schema'
import {
  Association as AssociationV1,
  AssociationType as AssociationTypeV1,
  DataType as DataTypeV1,
  DataTypeUuidDefaultVersion,
  Field as FieldV1,
  Model as ModelV1,
  SchemaV1,
} from '.'

export function fromV1(schema: SchemaV1): Schema {
  const models = schema.models.map(fromV1Model)
  return { ...schema, forkedFrom: schema.forkedFrom ?? null, models }
}

export function toV1(schema: Schema): SchemaV1 {
  return {
    ...schema,
    models: schema.models.map(toV1Model),
  }
}

function fromV1Model(model: ModelV1): Model {
  const fields = model.fields.map(fromV1Field)
  const associations = model.associations.map(fromV1Association)
  return { ...model, fields, associations }
}

function toV1Model(model: Model): ModelV1 {
  return {
    ...model,
    fields: model.fields.map(toV1Field),
    associations: model.associations.map(toV1Association),
  }
}

function fromV1Field(field: FieldV1): Field {
  return {
    ...field,
    type: fromV1DataType(field.type),
  }
}

function toV1Field(field: Field): FieldV1 {
  return {
    ...field,
    type: toV1DataType(field.type),
  }
}

function fromV1DataType(dataType: DataTypeV1): DataType {
  switch (dataType.type) {
    case 'STRING':
      return { ...dataType, length: dataType.length ?? null, type: DataTypeType.String }

    case 'TEXT':
      return { ...dataType, type: DataTypeType.Text }

    case 'CITEXT':
      return { ...dataType, type: DataTypeType.CiText }

    case 'INTEGER':
      return { ...dataType, type: DataTypeType.Integer }

    case 'BIGINT':
      return { ...dataType, type: DataTypeType.BigInt }

    case 'SMALLINT':
      return { ...dataType, type: DataTypeType.SmallInt }

    case 'FLOAT':
      return { ...dataType, type: DataTypeType.Float }

    case 'REAL':
      return { ...dataType, type: DataTypeType.Real }

    case 'DOUBLE':
      return { ...dataType, type: DataTypeType.Double }

    case 'DECIMAL': {
      const precision = dataType.precision
        ? { ...dataType.precision, scale: dataType.precision.scale || null }
        : null

      return { ...dataType, precision, type: DataTypeType.Decimal }
    }
    case 'DATE_TIME':
      return { ...dataType, type: DataTypeType.DateTime }

    case 'DATE':
      return { ...dataType, type: DataTypeType.Date }

    case 'TIME':
      return { ...dataType, type: DataTypeType.Time }

    case 'BOOLEAN':
      return { ...dataType, type: DataTypeType.Boolean }

    case 'ENUM':
      return { ...dataType, type: DataTypeType.Enum }

    case 'ARRAY':
      return { type: DataTypeType.Array, arrayType: fromV1DataType(dataType.arrayType) }

    case 'JSON':
      return { ...dataType, type: DataTypeType.Json }

    case 'JSONB':
      return { ...dataType, type: DataTypeType.JsonB }

    case 'BLOB':
      return { ...dataType, type: DataTypeType.Blob }

    case 'UUID':
      return {
        ...dataType,
        type: DataTypeType.Uuid,
        defaultVersion: fromV1UuidVersion(dataType.defaultVersion ?? null),
      }
  }
}

function toV1DataType(dataType: DataType): DataTypeV1 {
  switch (dataType.type) {
    case DataTypeType.String:
    case DataTypeType.Text:
    case DataTypeType.CiText:
    case DataTypeType.Integer:
    case DataTypeType.BigInt:
    case DataTypeType.SmallInt:
    case DataTypeType.Float:
    case DataTypeType.Real:
    case DataTypeType.Double:
    case DataTypeType.Decimal:
    case DataTypeType.DateTime:
    case DataTypeType.Date:
    case DataTypeType.Time:
    case DataTypeType.Boolean:
    case DataTypeType.Enum:
    case DataTypeType.Json:
    case DataTypeType.JsonB:
    case DataTypeType.Blob:
      return dataType

    case DataTypeType.Array:
      return { type: 'ARRAY', arrayType: toV1DataType(dataType.arrayType) }

    case DataTypeType.Uuid: {
      return {
        ...dataType,
        type: DataTypeType.Uuid,
        defaultVersion: toV1UuidVersion(dataType.defaultVersion),
      }
    }
  }
}

function fromV1UuidVersion(version: DataTypeUuidDefaultVersion | null): UuidType | null {
  switch (version) {
    case DataTypeUuidDefaultVersion.V1:
      return UuidType.V1
    case DataTypeUuidDefaultVersion.V4:
      return UuidType.V4
    case null:
      return null
  }
}

function toV1UuidVersion(version: UuidType | null): DataTypeUuidDefaultVersion | null {
  switch (version) {
    case UuidType.V1:
      return DataTypeUuidDefaultVersion.V1
    case UuidType.V4:
      return DataTypeUuidDefaultVersion.V4
    case null:
      return null
  }
}

function fromV1Association(association: AssociationV1): Association {
  return {
    ...association,
    alias: association.alias ?? null,
    foreignKey: association.foreignKey ?? null,
    type: fromV1AssociationType(association.type),
  }
}

function toV1Association(association: Association): AssociationV1 {
  return association
}

function fromV1AssociationType(associationType: AssociationTypeV1): AssociationType {
  switch (associationType.type) {
    case 'BELONGS_TO':
      return belongsToType()
    case 'HAS_ONE':
      return hasOneType()
    case 'HAS_MANY':
      return hasManyType()
    case 'MANY_TO_MANY':
      switch (associationType.through.type) {
        case 'THROUGH_MODEL':
          return manyToManyModelType(associationType.through.modelId, associationType.targetFk)
        case 'THROUGH_TABLE':
          return manyToManyTableType(associationType.through.table, associationType.targetFk)
      }
  }
}
