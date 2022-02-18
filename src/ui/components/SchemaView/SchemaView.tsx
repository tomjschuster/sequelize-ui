import { Model, Schema } from '@src/core/schema'
import {
  backgroundColor,
  classnames,
  display,
  fontSize,
  height,
  margin,
  overflow,
  padding,
  textAlign,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
import {
  breakWords,
  breakWordsMinus8,
  flexCenterBetween,
  panel,
  panelGrid,
  sectionWide,
  subtitle,
  title,
} from '@src/ui/styles/utils'
import { titleCase } from '@src/utils/string'
import React from 'react'
import Breadcrumbs from '../Breadcrumbs'
import PanelButton from '../form/PanelButton'
import EyeIcon from '../icons/Eye'
import PencilIcon from '../icons/Pencil'
import PlusCircleIcon from '../icons/Plus'
import TrashIcon from '../icons/Trash'
import ActionMenu from '../menus/ActionMenu'

type SchemaViewProps = {
  schema: Schema
  onClickModel: (model: Model) => void
  onClickAddModel: () => void
  onClickEditModel: (model: Model) => void
  onClickDeleteModel: (model: Model) => void
}

function SchemaView({
  schema,
  onClickModel,
  onClickAddModel,
  onClickEditModel,
  onClickDeleteModel,
}: SchemaViewProps): React.ReactElement {
  return (
    <div
      className={classnames(
        overflow('overflow-y-scroll'),
        height('h-full'),
        padding('p-2', 'xs:p-4', 'sm:p-6', 'pt-2'),
      )}
    >
      <Breadcrumbs items={[]} current={`${titleCase(schema.name)} (schema)`} />
      <div className={classnames(sectionWide)}>
        <h2 className={classnames(title)}>Schema</h2>
        <div className={classnames(margin('mb-11'))}>
          <p className={classnames(fontSize('text-lg'), breakWords)}>
            Name: {titleCase(schema.name)}
          </p>
        </div>
      </div>
      <div className={classnames(sectionWide)}>
        <h3 className={classnames(subtitle)}>Models</h3>
        <ul className={classnames(panelGrid)}>
          {schema.models.map((model) => (
            <li
              key={model.id}
              className={classnames(panel, flexCenterBetween, padding('px-2', 'py-3'))}
            >
              <button
                tabIndex={-1}
                className={classnames(
                  breakWordsMinus8,
                  textAlign('text-left'),
                  textDecoration('hover:underline'),
                  padding('px-1.5'),
                  fontSize('text-lg'),
                )}
                onClick={onClickModel.bind(null, model)}
              >
                {titleCase(model.name)}
              </button>
              <div className={classnames(display('flex'))}>
                <ActionMenu
                  items={[
                    {
                      icon: EyeIcon,
                      label: 'View',
                      onClick: onClickModel.bind(null, model),
                    },
                    {
                      icon: PencilIcon,
                      label: 'Edit',
                      onClick: onClickEditModel.bind(null, model),
                    },
                    {
                      icon: TrashIcon,
                      label: 'Delete',
                      onClick: onClickDeleteModel.bind(null, model),
                    },
                  ]}
                />
              </div>
            </li>
          ))}
          <li>
            <PanelButton
              className={classnames(
                backgroundColor(
                  backgroundColor('hover:bg-green-50', toClassname('dark:hover:bg-green-900')),
                ),
              )}
              label="Create a new model"
              icon={PlusCircleIcon}
              iconProps={{ size: 6 }}
              onClick={onClickAddModel}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default React.memo(SchemaView)
