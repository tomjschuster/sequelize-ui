import {
  backgroundColor,
  borderRadius,
  classnames,
  cursor,
  padding,
  TBackgroundColor,
  transitionDuration,
  transitionProperty,
  WithClassname,
} from '@src/ui/styles/classnames'
import React, { ButtonHTMLAttributes } from 'react'

export type MenuButtonProps = WithClassname<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive: boolean
  }
>

function MenuButton(
  { className, isActive, ...props }: MenuButtonProps,
  ref?: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  return (
    <button
      ref={ref}
      aria-haspopup={true}
      aria-expanded={isActive}
      className={classnames(
        className,
        cursor('cursor-pointer'),
        borderRadius('rounded-full'),
        padding('p-0.5'),
        backgroundColor({
          'bg-gray-300': isActive,
          'hover:bg-gray-200': !isActive,
          'dark:bg-gray-600': isActive,
          ['dark:hover:bg-gray-700' as TBackgroundColor]: !isActive,
        }),
        transitionProperty('transition'),
        transitionDuration('duration-300'),
      )}
      {...props}
    />
  )
}

export default React.memo(React.forwardRef(MenuButton))
