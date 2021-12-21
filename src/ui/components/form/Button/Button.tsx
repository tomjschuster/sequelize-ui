import {
  borderColor,
  borderRadius,
  borderWidth,
  Classname,
  classnames,
  fontSize,
  fontWeight,
  margin,
  outlineStyle,
  padding,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'
import IconButton from '../IconButton'

type ButtonProps = Override<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    className?: Classname
    icon?: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

function Button({
  className,
  children,
  icon: Icon,
  iconProps,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={classnames(
        flexCenter,
        padding('p-1'),
        borderWidth('border'),
        borderColor('border-gray-400'),
        borderRadius('rounded'),
        outlineStyle('focus:outline-none'),
        borderColor('focus-visible:border-blue-500'),
        fontWeight('focus-visible:font-bold'),
        className,
      )}
      {...props}
    >
      {Icon && <Icon {...iconProps} />}
      <span
        className={classnames(
          fontSize({ 'text-sm': !IconButton, 'text-xs': !!IconButton }),
          margin({ 'ml-1': !!IconButton }),
        )}
      >
        {children}
      </span>
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Button) as typeof Button
