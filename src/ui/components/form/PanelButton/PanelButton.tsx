import {
  borderColor,
  borderStyle,
  Classname,
  classnames,
  fontSize,
  margin,
  minHeight,
} from '@src/ui/styles/classnames'
import { panelAction } from '@src/ui/styles/utils'
import { Override } from '@src/utils/types'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type PanelButtonProps = Override<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    className?: Classname
    label: string
    icon: React.ComponentType<SvgProps>
    iconProps?: SvgProps
  }
>

export default function PanelButton({
  label,
  icon: Icon,
  iconProps,
  className,
  onClick,
  ...props
}: PanelButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className={classnames(
        className,
        panelAction,
        minHeight('min-h-16'),
        fontSize('text-lg'),
        borderStyle('border-dashed'),
        borderColor('hover:border-gray-800'),
      )}
      onClick={onClick}
      {...props}
    >
      <span className={classnames(margin('mr-2'))}>
        <Icon {...iconProps} />
      </span>
      {label}
    </button>
  )
}
