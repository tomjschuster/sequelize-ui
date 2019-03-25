export const SQL_IDENTIFIER_REGEXP = '^([\\p{L}_][\\p{L}\\p{N}$_ ]*)?$'
export const MAX_MODEL_NAME_LENGTH = 63
export const UNIQUE_NAME_ERROR = 'Name already taken.'
export const NAME_FORMAT_ERROR =
  'Name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'

export const REQUIRED_NAME_ERROR = 'Name is required.'
export const NAME_LENGTH_ERROR = `Name cannot be more than ${MAX_MODEL_NAME_LENGTH} characters when converted to snake_case.`
export const REQUIRED_TYPE_ERROR = 'Type is required.'

export const EMPTY_OPTION = 'EMPTY_OPTION'

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
  [EMPTY_OPTION]: '-',
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
