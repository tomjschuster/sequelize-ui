import {
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  Classname,
  classnames,
  fontSize,
  margin,
  outlineColor,
  outlineWidth,
  padding,
  textColor,
  TFontSize,
  toClassname,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type ButtonProps = Override<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    className?: Classname
    color?: ButtonColor
    size?: TFontSize
    icon?: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

export type ButtonColor = 'white' | 'blue' | 'red'

function buttonColorClassname(color?: ButtonColor): Classname {
  switch (color) {
    case 'white':
    case undefined:
      return classnames(backgroundColor('hover:bg-gray-100'), toClassname('dark:hover:bg-gray-700'))
    case 'blue':
      return classnames(
        textColor('text-gray-200'),
        backgroundColor(
          'bg-blue-600',
          'dark:bg-blue-700',
          'hover:bg-blue-400',
          toClassname('dark:hover:bg-blue-600'),
        ),
      )
    case 'red':
      return classnames(
        textColor('text-gray-200'),
        backgroundColor(
          'bg-red-600',
          'dark:bg-red-700',
          'hover:bg-red-400',
          toClassname('dark:hover:bg-red-600'),
        ),
      )
  }
}

function Button({
  className,
  children,
  icon: Icon,
  size = 'text-lg',
  color,
  iconProps,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={classnames(
        flexCenter,
        buttonColorClassname(color),
        padding('p-0.5', '2xs:p-1', 'xs:p-2'),
        borderWidth('border'),
        borderColor('border-gray-400'),
        borderRadius('rounded'),
        outlineColor('outline-black'),
        outlineWidth('outline-2'),
        className,
      )}
      {...props}
    >
      {Icon && <Icon {...iconProps} />}
      <span
        className={classnames(fontSize(size), margin({ 'ml-0.5': !!Icon, '2xs:ml-1': !!Icon }))}
      >
        {children}
      </span>
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Button) as typeof Button
