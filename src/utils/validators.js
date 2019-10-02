import XRegExp from 'xregexp'
import { pluralize } from 'inflection'
import Case from 'case'

import {
  ASSOC_TYPES,
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

export const validateUniqueAssoc = (assoc, assocs, models) => {
  const name = assocName(assoc, models)

  return !assocs.find(a =>
    a.id !== assoc.id &&
    Case.snake(name) === Case.snake(assocName(a, models)) &&
    a.type === assoc.type
      ? a.type === ASSOC_TYPES.HAS_ONE || a.type === ASSOC_TYPES.HAS_MANY
        ? a.foreignKey === assoc.foreignKey
        : a.type === ASSOC_TYPES.MANY_TO_MANY
          ? a.through === assoc.through &&
          (a.foreignKey === assoc.foreignKey ||
            a.targetForeignKey === assoc.targetForeignKey)
          : true
      : false
  )
}

const assocName = (assoc, models) => {
  const model = models.find(m => m.id === assoc.modelId)
  return assoc.name || (model && model.name) || null
}
