import RouteLink, { RouteLinkProps } from '@src/ui/routing/RouteLink'
import {
  borderColor,
  borderStyle,
  classnames,
  fontSize,
  margin,
  minHeight,
  WithClassname,
} from '@src/ui/styles/classnames'
import { flexCenter, panelAction } from '@src/ui/styles/utils'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

const panelActionClassname = classnames(
  panelAction,
  flexCenter,
  minHeight('min-h-16'),
  fontSize('text-lg'),
  borderStyle('border-dashed'),
  borderColor('hover:border-gray-800'),
)

type PanelButtonProps = WithClassname<
  React.ButtonHTMLAttributes<HTMLButtonElement> & PanelActionContentProps
>

export function PanelButton({
  label,
  icon,
  iconProps,
  className,
  ...props
}: PanelButtonProps): React.ReactElement {
  return (
    <button type="button" className={classnames(className, panelActionClassname)} {...props}>
      <PanelActionContent icon={icon} iconProps={iconProps} label={label} />
    </button>
  )
}

type PanelLinkProps = WithClassname<RouteLinkProps & PanelActionContentProps>

export function PanelLink({
  route,
  label,
  icon,
  iconProps,
  className,
  ...props
}: PanelLinkProps): React.ReactElement {
  return (
    <RouteLink route={route} className={classnames(className, panelActionClassname)} {...props}>
      <PanelActionContent icon={icon} iconProps={iconProps} label={label} />
    </RouteLink>
  )
}

type PanelActionContentProps = {
  label: string
  icon: React.ComponentType<SvgProps>
  iconProps?: SvgProps
}
function PanelActionContent({
  icon: Icon,
  iconProps,
  label,
}: PanelActionContentProps): React.ReactElement {
  return (
    <>
      <span className={classnames(margin('mr-2'))}>
        <Icon {...iconProps} />
      </span>
      {label}
    </>
  )
}
