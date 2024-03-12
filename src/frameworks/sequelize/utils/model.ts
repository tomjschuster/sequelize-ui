import { Association, Model } from '@src/core/schema'
import { pascalCase, singular } from '@src/utils/string'

export type ModelAssociation = {
  model: Model
  association: Association
}

export function modelName({ name }: Model): string {
  return singular(pascalCase(name))
}

export function modelFileName(model: Model): string {
  return `${modelName(model)}.ts`
}
