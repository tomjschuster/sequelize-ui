import React from 'react'
import { AlertMessage, AlertOptions } from '../types'
import { Alert, createAlert, hideAlert, showAlert } from './alert'

type Timeout = ReturnType<typeof setTimeout>

type AlertMessageData = {
  alert: Alert
  openingTimeout: Timeout
  messageTimeout: Timeout
  closingTimeout?: Timeout
}

type UseAlertStateResult = {
  alerts: Alert[]
  alert: (message: AlertMessage, options?: AlertOptions) => void
  dismissAlert: (id: string) => void
}

export default function useAlertState(): UseAlertStateResult {
  const [alertsData, setAlerts] = React.useState<AlertMessageData[]>([])
  const alerts = React.useMemo(() => alertsData.map((data) => data.alert), [alertsData])

  React.useEffect(
    () => () =>
      alertsData.forEach((message) => {
        clearTimeout(message.openingTimeout)
        clearTimeout(message.messageTimeout)
        if (message.closingTimeout !== undefined) clearTimeout(message.closingTimeout)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const dismissAlert = React.useCallback((id: string) => {
    const closingTimeout = setTimeout(() => {
      setAlerts((alertsData) => alertsData.filter((m) => m.alert.id !== id))
    }, 200)

    setAlerts((alertsData) =>
      alertsData.map((m) =>
        m.alert.id === id ? { ...m, alert: hideAlert(m.alert), closingTimeout } : m,
      ),
    )
  }, [])

  const alert = React.useCallback(
    (message: AlertMessage, options: AlertOptions = {}) => {
      const alert = createAlert(message, options)

      const openingTimeout = setTimeout(
        () =>
          setAlerts((alerts) =>
            alerts.map((m) => (m.alert.id === alert.id ? { ...m, alert: showAlert(alert) } : m)),
          ),
        1,
      )

      const messageTimeout = setTimeout(() => dismissAlert(alert.id), 1 + alert.ttl)

      setAlerts((alerts) => [...alerts, { alert, openingTimeout, messageTimeout }])
    },
    [dismissAlert],
  )

  return { alerts, alert, dismissAlert }
}
