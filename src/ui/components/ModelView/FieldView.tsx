import { displayDataType, displayDefaultValue, Field } from '@src/core/schema'
import {
  classnames,
  display,
  fontWeight,
  inset,
  justifyContent,
  margin,
  padding,
  position,
  toClassname,
} from '@src/ui/styles/classnames'
import { breakWordsMinus8, list, panelHeader } from '@src/ui/styles/utils'
import { noCase } from '@src/utils/string'
import React from 'react'
import PencilIcon from '../icons/Pencil'
import TrashIcon from '../icons/Trash'
import ActionMenu from '../menus/ActionMenu'

type FieldViewProps = {
  field: Field
  onClickEdit: () => void
  onClickDelete: () => void
}
function FieldView({ field, onClickEdit, onClickDelete }: FieldViewProps) {
  const defaultValue = displayDefaultValue(field.type)

  return (
    <>
      <div
        className={classnames(
          panelHeader,
          display('flex'),
          justifyContent('justify-between'),
          position('relative'),
        )}
      >
        <p className={classnames(padding('px-1'), fontWeight('font-bold'), breakWordsMinus8)}>
          {noCase(field.name)}
        </p>
        <ActionMenu
          className={classnames(position('absolute'), inset('right-0', 'top-1', 'right-1'))}
          items={[
            { icon: PencilIcon, label: 'Edit', onClick: onClickEdit },
            { icon: TrashIcon, label: 'Delete', onClick: onClickDelete },
          ]}
        />
      </div>
      <ul className={classnames(list, padding('p-2', 'pl-4'))}>
        <li>{displayDataType(field.type)}</li>
        {field.primaryKey && <li>Primary key</li>}
        {field.required && <li>Required</li>}
        {field.unique && <li>Unique</li>}
        {defaultValue && (
          <li>
            <span className={classnames(display('flex'))}>
              Default:{' '}
              <pre className={classnames(margin('ml-1'), toClassname('pt-[0.5px]'))}>
                {defaultValue}
              </pre>
            </span>
          </li>
        )}
      </ul>
    </>
  )
}

export default React.memo(FieldView)
