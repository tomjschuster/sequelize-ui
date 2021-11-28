import dynamic from 'next/dynamic'
import React from 'react'
import useAlertState from './internal/useAlertState'
import { AlertLevel, AlertMessage, AlertOptions } from './types'
const AlertsContainer = dynamic(() => import('./internal/AlertsContainer'))

export type AlertContext = {
  alert: (message: AlertMessage, options?: AlertOptions) => void
  info: (message: AlertMessage, options?: AlertOptions) => void
  success: (message: AlertMessage, options?: AlertOptions) => void
  warning: (message: AlertMessage, options?: AlertOptions) => void
  error: (message: AlertMessage, options?: AlertOptions) => void
}

const AlertContext = React.createContext<AlertContext>({
  alert: () => null,
  info: () => null,
  success: () => null,
  warning: () => null,
  error: () => null,
})

export function AlertProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { alerts, alert, dismissAlert } = useAlertState()

  const info = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = {}) =>
      alert(message, { level: AlertLevel.Info, ...options }),
    [alert],
  )

  const success = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = {}) =>
      alert(message, { level: AlertLevel.Success, ...options }),
    [alert],
  )

  const warning = React.useCallback(
    (message: AlertMessage, { level: _, ...options }: AlertOptions = {}) =>
      alert(message, { level: AlertLevel.Warning, ...options }),
    [alert],
  )

  const error = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = {}) =>
      alert(message, { level: AlertLevel.Error, ...options }),
    [alert],
  )

  return (
    <>
      <AlertContext.Provider value={{ alert, info, success, warning, error }}>
        {children}
      </AlertContext.Provider>
      {alerts.length > 0 && (
        <AlertsContainer
          // ref={ref}
          alerts={alerts}
          onDismiss={dismissAlert}
        />
      )}
    </>
  )
}

export const AlertConsumer = AlertContext.Consumer

export function useAlert(): AlertContext {
  return React.useContext(AlertContext)
}
