import {
  arrayDataType,
  association,
  Association,
  AssociationType,
  AssociationTypeType,
  belongsToType,
  bigIntDataType,
  blobDataType,
  booleanDataType,
  ciTextDataType,
  DataType,
  DataTypeType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  doubleDataType,
  enumDataType,
  field,
  Field,
  floatDataType,
  hasManyType,
  hasOneType,
  integerDataType,
  jsonBDataType,
  jsonDataType,
  manyToManyModelType,
  manyToManyTableType,
  model,
  Model,
  realDataType,
  schema,
  Schema,
  smallIntDataType,
  stringDataType,
  textDataType,
  ThroughType,
  timeDataType,
  uuidDataType,
  UuidType,
} from '@src/core/schema'
import {
  AssociationType as AssociationTypeV1,
  Association as AssociationV1,
  DataTypeUuidDefaultVersion,
  DataType as DataTypeV1,
  Field as FieldV1,
  Model as ModelV1,
  SchemaV1,
} from '.'

export function fromV1(schemaV1: SchemaV1): Schema {
  const models = schemaV1.models.map(fromV1Model)
  return schema({ ...schemaV1, forkedFrom: schemaV1.forkedFrom ?? null, models })
}

export function toV1(schema: Schema): SchemaV1 {
  return {
    id: schema.id,
    name: schema.name,
    forkedFrom: schema.forkedFrom,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
    models: schema.models.map(toV1Model),
  }
}

function fromV1Model(modelV1: ModelV1): Model {
  const fields = modelV1.fields.map(fromV1Field)
  const associations = modelV1.associations.map(fromV1Association)
  return model({ ...modelV1, fields, associations })
}

function toV1Model(model: Model): ModelV1 {
  return {
    id: model.id,
    name: model.name,
    softDelete: model.softDelete,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    fields: model.fields.map(toV1Field),
    associations: model.associations.map(toV1Association),
  }
}

function fromV1Field(fieldV1: FieldV1): Field {
  return field({
    ...fieldV1,
    type: fromV1DataType(fieldV1.type),
  })
}

function toV1Field(field: Field): FieldV1 {
  return {
    id: field.id,
    name: field.name,
    type: toV1DataType(field.type),
    primaryKey: field.primaryKey,
    required: field.required,
    unique: field.unique,
  }
}

function fromV1DataType(dataType: DataTypeV1): DataType {
  switch (dataType.type) {
    case 'STRING': {
      const { type: _, ...opts } = dataType
      return stringDataType(opts)
    }

    case 'TEXT': {
      const { type: _, ...opts } = dataType
      return textDataType(opts)
    }

    case 'CITEXT': {
      const { type: _, ...opts } = dataType
      return ciTextDataType(opts)
    }

    case 'INTEGER': {
      const { type: _, ...opts } = dataType
      return integerDataType(opts)
    }

    case 'BIGINT': {
      const { type: _, ...opts } = dataType
      return bigIntDataType(opts)
    }

    case 'SMALLINT': {
      const { type: _, ...opts } = dataType
      return smallIntDataType(opts)
    }

    case 'FLOAT': {
      const { type: _, ...opts } = dataType
      return floatDataType(opts)
    }

    case 'REAL': {
      const { type: _, ...opts } = dataType
      return realDataType(opts)
    }

    case 'DOUBLE': {
      const { type: _, ...opts } = dataType
      return doubleDataType(opts)
    }

    case 'DECIMAL': {
      const { type: _, precision, ...opts } = dataType
      return decimalDataType({
        ...opts,
        precision: precision ? { ...precision, scale: precision.scale || null } : null,
      })
    }
    case 'DATE_TIME': {
      const { type: _, ...opts } = dataType
      return dateTimeDataType(opts)
    }

    case 'DATE': {
      const { type: _, ...opts } = dataType
      return dateDataType(opts)
    }

    case 'TIME': {
      const { type: _, ...opts } = dataType
      return timeDataType(opts)
    }

    case 'BOOLEAN': {
      const { type: _, defaultValue, ...opts } = dataType
      return booleanDataType({ ...opts, defaultValue: defaultValue ?? null })
    }

    case 'ENUM': {
      const { type: _, ...opts } = dataType
      return enumDataType(opts)
    }

    case 'ARRAY': {
      const { type: _, arrayType, defaultEmptyArray, ...opts } = dataType
      return arrayDataType({
        ...opts,
        arrayType: fromV1DataType(arrayType),
        defaultEmptyArray: defaultEmptyArray ?? false,
      })
    }

    case 'JSON': {
      const { type: _, defaultValue, ...opts } = dataType
      return jsonDataType({ ...opts, defaultValue: defaultValue ?? null })
    }

    case 'JSONB': {
      const { type: _, defaultValue, ...opts } = dataType
      return jsonBDataType({ ...opts, defaultValue: defaultValue ?? null })
    }

    case 'BLOB': {
      return blobDataType()
    }

    case 'UUID': {
      const { type: _, defaultVersion, ...opts } = dataType
      return uuidDataType({ ...opts, defaultVersion: fromV1UuidVersion(defaultVersion ?? null) })
    }
  }
}

function toV1DataType(dataType: DataType): DataTypeV1 {
  switch (dataType.type) {
    case DataTypeType.String:
      return {
        type: 'STRING',
        length: dataType.length,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Text:
      return {
        type: 'TEXT',
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.CiText:
      return {
        type: 'CITEXT',
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Integer:
      return {
        type: 'INTEGER',
        autoincrement: dataType.autoincrement,
        unsigned: dataType.unsigned,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.BigInt:
      return {
        type: 'BIGINT',
        unsigned: dataType.unsigned,
        autoincrement: dataType.autoincrement,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.SmallInt:
      return {
        type: 'SMALLINT',
        unsigned: dataType.unsigned,
        autoincrement: dataType.autoincrement,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Float:
      return {
        type: 'FLOAT',
        unsigned: dataType.unsigned,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Real:
      return {
        type: 'REAL',
        unsigned: dataType.unsigned,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Double:
      return {
        type: 'DOUBLE',
        unsigned: dataType.unsigned,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.Decimal:
      return {
        type: 'DECIMAL',
        unsigned: dataType.unsigned,
        precision: dataType.precision,
        defaultValue: dataType.defaultValue,
      }
    case DataTypeType.DateTime:
      return {
        type: 'DATE_TIME',
        defaultNow: dataType.defaultNow,
      }
    case DataTypeType.Date:
      return {
        type: 'DATE',
        defaultNow: dataType.defaultNow,
      }
    case DataTypeType.Time:
      return {
        type: 'TIME',
        defaultNow: dataType.defaultNow,
      }

    case DataTypeType.Boolean:
      return {
        type: 'BOOLEAN',
        defaultValue: dataType.defaultValue,
      }

    case DataTypeType.Enum:
      return {
        type: 'ENUM',
        values: dataType.values,
        defaultValue: dataType.defaultValue,
      }

    case DataTypeType.Json:
      return {
        type: 'JSON',
        defaultValue: dataType.defaultValue,
      }

    case DataTypeType.JsonB:
      return {
        type: 'JSONB',
        defaultValue: dataType.defaultValue,
      }

    case DataTypeType.Blob:
      return dataType

    case DataTypeType.Array:
      return {
        type: 'ARRAY',
        arrayType: toV1DataType(dataType.arrayType),
        defaultEmptyArray: dataType.defaultEmptyArray,
      }

    case DataTypeType.Uuid: {
      return {
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

function fromV1Association(associationV1: AssociationV1): Association {
  return association({
    ...associationV1,
    alias: associationV1.alias ?? null,
    foreignKey: associationV1.foreignKey ?? null,
    type: fromV1AssociationType(associationV1.type),
  })
}

function toV1Association(association: Association): AssociationV1 {
  return {
    id: association.id,
    sourceModelId: association.sourceModelId,
    targetModelId: association.targetModelId,
    alias: association.alias,
    foreignKey: association.foreignKey,
    type: toV1AssociationType(association.type),
  }
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

function toV1AssociationType(associationType: AssociationType): AssociationTypeV1 {
  switch (associationType.type) {
    case AssociationTypeType.BelongsTo:
      return { type: 'BELONGS_TO' }
    case AssociationTypeType.HasOne:
      return { type: 'HAS_ONE' }
    case AssociationTypeType.HasMany:
      return { type: 'HAS_MANY' }
    case AssociationTypeType.ManyToMany:
      switch (associationType.through.type) {
        case ThroughType.ThroughModel:
          return {
            type: 'MANY_TO_MANY',
            targetFk: associationType.targetFk,
            through: { type: 'THROUGH_MODEL', modelId: associationType.through.modelId },
          }
        case ThroughType.ThroughTable:
          return {
            type: 'MANY_TO_MANY',
            targetFk: associationType.targetFk,
            through: { type: 'THROUGH_TABLE', table: associationType.through.table },
          }
      }
  }
}
