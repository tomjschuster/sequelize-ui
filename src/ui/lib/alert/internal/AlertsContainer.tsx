import { useTrapFocus } from '@src/ui/lib/focus'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { Alert, isAlertVisible } from './alert'
import AlertDisplay from './AlertDisplay'

type AlertsContainerProps = {
  alerts: Alert[]
  onDismiss: (id: string) => void
}

// const AlertsContainer = React.forwardRef<HTMLUListElement, AlertsContainerProps>(
function AlertsContainer({ alerts, onDismiss }: AlertsContainerProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLUListElement>
  useTrapFocus({ ref, global: true })
  return (
    <ul ref={ref}>
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </ul>
  )
}
// )

type AlertItemProps = {
  alert: Alert
  onDismiss: (id: string) => void
}
function AlertItem({ alert, onDismiss }: AlertItemProps): React.ReactElement {
  return (
    <li
      key={`${alert.id}`}
      className={classnames(
        'z-50',
        'fixed',
        'p-1',
        'sm:p-1.5',
        'top-0',
        'left-0',
        'sm:left-1/2',
        'sm:-translate-x-1/2',
        'transition-transform',
        'transform-gpu',
        {
          'scale-0': !isAlertVisible(alert),
          'scale-100': isAlertVisible(alert),
        },
      )}
    >
      <AlertDisplay alert={alert} onDismiss={onDismiss} />
    </li>
  )
}

export default React.memo(AlertsContainer)
