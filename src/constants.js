export const SQL_IDENTIFIER_REGEXP = '^([\\p{L}_][\\p{L}\\p{N}$_ ]*)?$'
export const MAX_MODEL_NAME_LENGTH = 63
export const UNIQUE_NAME_ERROR = 'Name already taken.'
export const NAME_FORMAT_ERROR =
  'Name can only contain letters, numbers, spaces, _ or $ and cannot start with a number.'

export const REQUIRED_NAME_ERROR = 'Name is required.'
export const NAME_LENGTH_ERROR = `Name cannot be more than ${MAX_MODEL_NAME_LENGTH} characters when converted to snake_case.`
export const REQUIRED_TYPE_ERROR = 'Type is required.'
