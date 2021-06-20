import { Association, associationTypeIsSingular, Model } from '@src/core/schema'
import { camelCase, plural, singular } from '@src/utils/string'
import { modelName } from './model'

type AssociationNameArgs = {
  association: Association
  targetModel: Model
}
export function associationName({ association, targetModel }: AssociationNameArgs): string {
  const name = association.alias ? camelCase(association.alias) : modelName(targetModel)
  return associationTypeIsSingular(association.type) ? singular(name) : plural(name)
}
