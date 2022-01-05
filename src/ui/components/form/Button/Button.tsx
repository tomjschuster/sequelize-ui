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
  TFontSize,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type ButtonProps = Override<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    className?: Classname
    size?: TFontSize
    icon?: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

function Button({
  className,
  children,
  icon: Icon,
  size = 'text-lg',
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
      <span className={classnames(fontSize(size), margin({ 'ml-1': !!Icon }))}>{children}</span>
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Button) as typeof Button
