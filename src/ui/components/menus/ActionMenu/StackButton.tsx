import {
  backgroundColor,
  borderRadius,
  classnames,
  cursor,
  height,
  padding,
  space,
  transitionProperty,
  width,
} from '@src/ui/styles/classnames'
import { flexCenterColumn } from '@src/ui/styles/utils'
import React, { ButtonHTMLAttributes } from 'react'
import Dot from './Dot'

type StackButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { isActive: boolean }

function StackButton({ isActive, ...props }: StackButtonProps): React.ReactElement {
  return (
    <button
      aria-haspopup={true}
      aria-expanded={isActive}
      title="Actions"
      aria-label="actions"
      className={classnames(
        flexCenterColumn,
        width('w-8'),
        height('h-8'),
        space('space-y-0.5'),
        borderRadius('rounded-full'),
        padding('p-2'),
        cursor('cursor-pointer'),
        backgroundColor({ 'bg-gray-300': isActive, 'hover:bg-gray-200': !isActive }),
        transitionProperty('transition'),
      )}
      {...props}
    >
      <Dot />
      <Dot />
      <Dot />
    </button>
  )
}

export default React.memo(StackButton)
