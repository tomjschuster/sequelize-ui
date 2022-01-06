import {
  alignSelf,
  backgroundColor,
  Classname,
  classnames,
  margin,
  padding,
} from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type IconButtonProps = Override<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    className?: Classname
    padding?: Classname
    label: string
    icon: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

function IconButton({
  className,
  padding: padding_ = padding('p-1'),
  label,
  icon: Icon,
  iconProps,
  ...rest
}: IconButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className={classnames(
        padding_,
        backgroundColor('hover:bg-gray-200'),
        alignSelf('self-start'),
        margin('ml-0.5'),
        className,
      )}
      {...rest}
    >
      <Icon title={label} {...iconProps} />
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(IconButton) as typeof IconButton
