import {
  Association,
  displayAssociationTypeType,
  displayThroughType,
  isManytoMany,
  isThroughModel,
  Model,
  Schema,
} from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import { noCase, titleCase } from '@src/utils/string'
import React, { useMemo } from 'react'

type AssociationViewProps = {
  association: Association
  schema: Schema
}

function AssociationView({ association, schema }: AssociationViewProps): React.ReactElement {
  const targetModel: Model = useMemo(
    () => schema.models.find((m) => m.id === association.targetModelId) as Model,
    [schema.models, association.targetModelId],
  )

  const throughName: string | undefined = useMemo(() => {
    if (isManytoMany(association)) {
      const through = association.type.through
      if (isThroughModel(through)) {
        const throughModel = schema.models.find((m) => m.id === through.modelId)
        if (throughModel) return titleCase(throughModel.name)
      } else {
        return noCase(through.table)
      }
    }
  }, [association, schema])

  return (
    <div
      className={classnames(
        'p-4',
        'pt-8',
        'grid',
        'grid-cols-12',
        'gap-y-2',
        'gap-x-4',
        'relative',
      )}
    >
      <div className={classnames('col-span-6')}>
        <p>
          {displayAssociationTypeType(association.type.type)} {titleCase(targetModel.name)}
          {association.alias ? ` as ${noCase(association.alias)}` : ''}
          {association.foreignKey ? ` (foreign key: ${noCase(association.foreignKey)})` : ''}
          {isManytoMany(association) && throughName
            ? ` through ${throughName} ${displayThroughType(association.type.through.type)}`
            : ''}
          {isManytoMany(association) && association.type.targetFk
            ? ` (target foreign key: ${noCase(association.type.targetFk)})`
            : ''}
        </p>
      </div>
    </div>
  )
}

export default React.memo(AssociationView)
