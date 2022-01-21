import { Association, Field, Model } from '@src/core/schema'
import { dedupBy } from '@src/utils/array'
import { namesEqSingular, noCase, normalize, pascalCase, singular } from '@src/utils/string'

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

export function dedupModels(models: Model[]): Model[] {
  const visitedModels: Record<string, Model> = {}
  const names: string[] = []
  models.forEach((model) => {
    const name = noCase(model.name)
    const visitedModel = visitedModels[name]
    if (visitedModel) {
      visitedModels[name] = mergeFields(visitedModel, model)
    } else {
      visitedModels[name] = model
      names.push(name)
    }
  })

  return names.map((name) => visitedModels[name])
}

function mergeFields(x: Model, y: Model): Model {
  const xHasPk = x.fields.some((f) => f.primaryKey)

  const [, yDiffs] = y.fields.reduce(
    (acc, y_) => {
      const yWithoutPk = { ...y_, primaryKey: false }
      const y = xHasPk ? yWithoutPk : y_
      if (x.fields.some((x) => namesEqSingular(x.name, y.name))) {
        acc[0].push(y)
      } else {
        acc[1].push(y)
      }
      return acc
    },
    [[], []] as [Field[], Field[]],
  )

  const fields = dedupBy([...x.fields, ...yDiffs], (f) => normalize(f.name))
  return { ...x, fields }
}
