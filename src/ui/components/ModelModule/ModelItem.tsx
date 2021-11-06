import { Model } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames/__generated__/tailwindcss-classnames'
import { titleCase } from '@src/utils/string'
import React, { useCallback } from 'react'
import CloseCircleIcon from '../icons/CloseCircle'
import PencilIcon from '../icons/Pencil'
import * as styles from './styles'

const panel = classnames('border', 'border-gray-400', 'rounded')

type ModelItemProps = {
  model: Model
  onEdit: (id: Model['id']) => void
  onDelete: (id: Model['id']) => void
}
export default function ModelItem({ model, onEdit, onDelete }: ModelItemProps): React.ReactElement {
  const handleClickEdit = useCallback(() => onEdit(model.id), [model.id])

  const handleDelete = useCallback(
    (evt: React.FormEvent<HTMLButtonElement>) => {
      evt.preventDefault()
      onDelete(model.id)
    },
    [onDelete, model.id],
  )

  return (
    <li className={classnames(panel, 'flex', 'justify-between', 'px-2')} onClick={handleClickEdit}>
      <span onClick={handleClickEdit} className={styles.modelName}>
        {titleCase(model.name)}
      </span>
      <div className={classnames('flex', 'items-center')}>
        <button className={classnames('hover:bg-gray-200', 'p-1.5')} onClick={handleClickEdit}>
          <PencilIcon title="edit" />
        </button>
        <button className={classnames('hover:bg-gray-200', 'p-1.5')} onClick={handleDelete}>
          <CloseCircleIcon title="delete" />
        </button>
      </div>
    </li>
  )
}
