import React from 'react'
import * as Styles from './styles'

type ControlsBarProps = {
  children: React.ReactNode
}
export default function ControlsBar({ children }: ControlsBarProps): React.ReactElement {
  return <div className={Styles.actions}>{children}</div>
}

const overlayButtonProps: Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onMouseDown' | 'onTouchStart'
> = { onMouseDown: (evt) => evt.stopPropagation(), onTouchStart: (evt) => evt.stopPropagation() }

type ControlsActionProps = { overlayControl?: boolean } & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
>

export function ControlsAction({
  overlayControl,
  ...props
}: ControlsActionProps): React.ReactElement {
  const extraProps = overlayControl ? overlayButtonProps : {}
  return <button className={Styles.actionButton} {...props} {...extraProps} />
}
