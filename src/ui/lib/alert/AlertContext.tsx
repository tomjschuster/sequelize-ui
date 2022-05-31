import ErrorBoundary from '@src/ui/components/ErrorBoundary'
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

const defaultOptions: AlertOptions = {}

export function AlertProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // just render children when provider errors
  const ErrorWrapper: React.FC = React.useCallback(() => <>{children}</>, [children])

  return (
    <ErrorBoundary wrapper={ErrorWrapper}>
      <AlertProvider_>{children}</AlertProvider_>
    </ErrorBoundary>
  )
}

function AlertProvider_({ children }: { children: React.ReactNode }): React.ReactElement {
  const { alerts, alert, dismissAlert } = useAlertState()

  const info = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = defaultOptions) =>
      alert(message, { level: AlertLevel.Info, ...options }),
    [alert],
  )

  const success = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = defaultOptions) =>
      alert(message, { level: AlertLevel.Success, ...options }),
    [alert],
  )

  const warning = React.useCallback(
    (message: AlertMessage, { level: _, ...options }: AlertOptions = defaultOptions) =>
      alert(message, { level: AlertLevel.Warning, ...options }),
    [alert],
  )

  const error = React.useCallback(
    (message: AlertMessage, { level: _, ...options } = defaultOptions) =>
      alert(message, { level: AlertLevel.Error, ...options }),
    [alert],
  )

  return (
    <>
      <AlertContext.Provider value={{ alert, info, success, warning, error }}>
        {children}
      </AlertContext.Provider>
      <AlertsContainer alerts={alerts} onDismiss={dismissAlert} />
    </>
  )
}

export const AlertConsumer = AlertContext.Consumer

export function useAlert(): AlertContext {
  return React.useContext(AlertContext)
}
