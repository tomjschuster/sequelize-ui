import {
  borderRadius,
  classnames,
  height,
  padding,
  space,
  width,
  WithClassname,
} from '@src/ui/styles/classnames'
import React, { ButtonHTMLAttributes } from 'react'
import MenuButton from '../MenuButton'
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
    <MenuButton
      ref={ref}
      isActive={isActive}
      title="Actions"
      aria-label="actions"
      className={classnames(
        className,
        width('w-8'),
        height('h-8'),
        space('space-y-0.5'),
        borderRadius('rounded-full'),
        padding('px-1'),
      )}
      {...props}
    >
      <Dot />
      <Dot />
      <Dot />
    </MenuButton>
  )
}

export default React.memo(React.forwardRef(StackButton))
