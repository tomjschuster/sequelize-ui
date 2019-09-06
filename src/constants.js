export const SQL_IDENTIFIER_REGEXP = '^([\\p{L}_][\\p{L}\\p{N}$_ ]*)?$'

export const MAX_SQL_IDENTIFIER_LENGTH = 63

export const DATA_TYPES = {
  STRING: 'STRING',
  TEXT: 'TEXT',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  REAL: 'REAL',
  DOUBLE: 'DOUBLE',
  DECIMAL: 'DECIMAL',
  DATE: 'DATE',
  DATEONLY: 'DATEONLY',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  JSON_: 'JSON_',
  BLOB: 'BLOB',
  UUID: 'UUID'
}

export const DATA_TYPE_OPTIONS = {
  [DATA_TYPES.STRING]: 'String',
  [DATA_TYPES.TEXT]: 'Text',
  [DATA_TYPES.INTEGER]: 'Integer',
  [DATA_TYPES.FLOAT]: 'Float',
  [DATA_TYPES.REAL]: 'Real',
  [DATA_TYPES.DOUBLE]: 'Double',
  [DATA_TYPES.DECIMAL]: 'Decimal',
  [DATA_TYPES.DATE]: 'Date',
  [DATA_TYPES.DATEONLY]: 'Date (without time)',
  [DATA_TYPES.BOOLEAN]: 'Boolean',
  [DATA_TYPES.ARRAY]: 'Array',
  [DATA_TYPES.JSON_]: 'JSON',
  [DATA_TYPES.BLOB]: 'BLOB',
  [DATA_TYPES.UUID]: 'UUID'
}

export const ASSOC_TYPES = {
  BELONGS_TO: 'BELONGS_TO',
  HAS_ONE: 'HAS_ONE',
  HAS_MANY: 'HAS_MANY'
}

export const ASSOC_TYPE_OPTIONS = {
  [ASSOC_TYPES.BELONGS_TO]: 'Belongs to',
  [ASSOC_TYPES.HAS_ONE]: 'Has one',
  [ASSOC_TYPES.HAS_MANY]: 'Has many'
}
