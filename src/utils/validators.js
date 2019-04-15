import XRegExp from 'xregexp'
import { pluralize } from 'inflection'
import Case from 'case'

import {
  SQL_IDENTIFIER_REGEXP,
  MAX_SQL_IDENTIFIER_LENGTH
} from '../constants.js'

export const validateUniqueName = (item, items) =>
  !items.find(
    ({ name, id }) =>
      Case.snake(name) === Case.snake(item.name) && id !== item.id
  )

export const validateIdentifierFormat = identifier =>
  XRegExp(SQL_IDENTIFIER_REGEXP).test(identifier)

export const validateIdentifierLength = identifier =>
  pluralize(Case.snake(identifier)).length <= MAX_SQL_IDENTIFIER_LENGTH

export const validateRequired = s => s && s.length
