import {
  Association,
  displayAssociationTypeType,
  isManytoMany,
  ManyToManyThrough,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import {
  backgroundColor,
  classnames,
  fontWeight,
  inset,
  maxWidth,
  padding,
  position,
  toClassname,
} from '@src/ui/styles/classnames'
import { breakWordsMinus8, inlineButton, list, panelHeader } from '@src/ui/styles/utils'
import { noCase, titleCase } from '@src/utils/string'
import React from 'react'
import PencilIcon from '../icons/Pencil'
import TrashIcon from '../icons/Trash'
import ActionMenu from '../menus/ActionMenu'

type AssociationViewProps = {
  association: Association
  schema: Schema
  onClickModel: (model: Model) => void
  onClickEdit: () => void
  onClickDelete: () => void
}

function AssociationView({
  association,
  schema,
  onClickModel,
  onClickEdit,
  onClickDelete,
}: AssociationViewProps): React.ReactElement {
  const targetModel: Model | null =
    React.useMemo(
      () => schema.models.find((m) => m.id === association.targetModelId) as Model,
      [schema.models, association.targetModelId],
    ) || null

  return (
    // model might be missing briefly after deletion and before switching flyout state
    targetModel && (
      <>
        <div className={classnames(panelHeader, position('relative'))}>
          <p className={classnames(breakWordsMinus8)}>
            {displayAssociationTypeType(association.type.type)}{' '}
            {targetModel.id === association.sourceModelId ? (
              <span className={classnames(fontWeight('font-semibold'))}>
                {titleCase(targetModel.name)}
              </span>
            ) : (
              <button
                className={classnames(
                  maxWidth('max-w-full'),
                  inlineButton(
                    backgroundColor('bg-indigo-100', toClassname('dark:hover:bg-indigo-900')),
                  ),
                  fontWeight('font-semibold'),
                )}
                onClick={() => onClickModel(targetModel)}
              >
                {titleCase(targetModel.name)}
              </button>
            )}
          </p>
          <ActionMenu
            className={classnames(position('absolute'), inset('right-0', 'top-1', 'right-1'))}
            items={[
              { icon: PencilIcon, label: 'Edit', onClick: onClickEdit },
              { icon: TrashIcon, label: 'Delete', onClick: onClickDelete },
            ]}
          />
        </div>
        {(association.alias || association.foreignKey || isManytoMany(association)) && (
          <ul className={classnames(list, padding('p-2', 'pl-4'))}>
            {association.alias && <li>as {noCase(association.alias)}</li>}
            {association.foreignKey && <li>Foreign key: {noCase(association.foreignKey)}</li>}
            {isManytoMany(association) && (
              <li>
                through{' '}
                <ThroughView
                  through={association.type.through}
                  schema={schema}
                  onClickModel={onClickModel}
                />
              </li>
            )}
            {isManytoMany(association) && association.type.targetFk && (
              <li>Target foreign key: {noCase(association.type.targetFk)}</li>
            )}
          </ul>
        )}
      </>
    )
  )
}

type ThroughViewProps = {
  through: ManyToManyThrough
  schema: Schema
  onClickModel: (model: Model) => void
}
function ThroughView({
  through,
  schema,
  onClickModel,
}: ThroughViewProps): React.ReactElement | null {
  if (through.type === ThroughType.ThroughTable) {
    return <>{through.table}</>
  }

  const throughModel = schema.models.find((m) => m.id === through.modelId)
  if (throughModel) {
    return (
      <button
        className={classnames(fontWeight('font-bold'))}
        onClick={() => onClickModel(throughModel)}
      >
        {titleCase(throughModel.name)}
      </button>
    )
  }

  return null
}

export default React.memo(AssociationView)
