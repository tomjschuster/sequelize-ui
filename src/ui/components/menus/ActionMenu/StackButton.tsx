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
  WithClassname,
} from '@src/ui/styles/classnames'
import { flexCenterColumn } from '@src/ui/styles/utils'
import React, { ButtonHTMLAttributes } from 'react'
import Dot from './Dot'

type StackButtonProps = WithClassname<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive: boolean
  }
>

function StackButton(
  { className, isActive, ...props }: StackButtonProps,
  ref?: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  return (
    <button
      ref={ref}
      aria-haspopup={true}
      aria-expanded={isActive}
      title="Actions"
      aria-label="actions"
      className={classnames(
        className,
        flexCenterColumn,
        width('w-8'),
        height('h-8'),
        space('space-y-0.5'),
        borderRadius('rounded-full'),
        padding('px-1'),
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

export default React.memo(React.forwardRef(StackButton))
