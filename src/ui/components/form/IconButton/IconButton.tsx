import {
  backgroundColor,
  Classname,
  classnames,
  padding,
  toClassname,
} from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type IconButtonProps = Override<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  {
    className?: Classname
    padding?: Classname
    label: string
    icon: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

function IconButton(
  {
    className,
    padding: padding_ = padding('p-1'),
    label,
    icon: Icon,
    iconProps,
    ...rest
  }: IconButtonProps,
  ref?: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  return (
    <button
      ref={ref}
      type="button"
      className={classnames(
        padding_,
        backgroundColor('hover:bg-gray-200', toClassname('dark:hover:bg-gray-600')),
        className,
      )}
      {...rest}
    >
      <Icon title={label} {...iconProps} />
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(React.forwardRef(IconButton)) as typeof IconButton
