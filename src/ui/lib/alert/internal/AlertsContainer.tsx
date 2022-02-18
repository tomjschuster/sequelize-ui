import { useTrapFocus } from '@src/ui/lib/focus'
import {
  classnames,
  display,
  hardwareAcceleration,
  inset,
  maxWidth,
  minWidth,
  padding,
  position,
  scale,
  toClassname,
  transitionProperty,
  translate,
  zIndex,
} from '@src/ui/styles/classnames'
import React from 'react'
import { Alert, isAlertVisible } from './alert'
import AlertDisplay from './AlertDisplay'

type AlertsContainerProps = {
  alerts: Alert[]
  onDismiss: (id: string) => void
}

function AlertsContainer({ alerts, onDismiss }: AlertsContainerProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLUListElement>
  const hidden = alerts.length === 0

  useTrapFocus({ ref, global: true, skip: hidden })

  return (
    <ul
      ref={ref}
      aria-live={hidden ? 'off' : 'assertive'}
      className={classnames(display({ hidden }))}
    >
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </ul>
  )
}

type AlertItemProps = {
  alert: Alert
  onDismiss: (id: string) => void
}
function AlertItem({ alert, onDismiss }: AlertItemProps): React.ReactElement {
  return (
    <li
      key={`${alert.id}`}
      className={classnames(
        zIndex('z-50'),
        minWidth('min-w-72'),
        maxWidth('max-w-full', 'lg:max-w-96'),
        position('fixed'),
        padding('p-1', 'sm:p-1.5'),
        inset('top-0', 'left-0', 'sm:left-1/2'),
        translate(toClassname('sm:-translate-x-1/2')),
        transitionProperty('transition-transform'),
        hardwareAcceleration('transform-gpu'),
        scale({
          'scale-0': !isAlertVisible(alert),
          'scale-100': isAlertVisible(alert),
        }),
      )}
    >
      <AlertDisplay alert={alert} onDismiss={onDismiss} />
    </li>
  )
}

export default React.memo(AlertsContainer)
