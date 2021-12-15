import { Classname, classnames } from '@src/ui/styles/classnames'
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
        'min-h-16',
        'text-lg',
        'border-dashed',
        'hover:border-gray-800',
      )}
      onClick={onClick}
      {...props}
    >
      <span className={classnames('mr-2')}>
        <Icon {...iconProps} />
      </span>
      {label}
    </button>
  )
}
