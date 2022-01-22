import { uniqueId } from '@src/utils/string'
import { AlertLevel, AlertMessage, AlertOptions } from '../types'

enum AlertState {
  Opening = 'opening',
  Open = 'open',
  Closing = 'closing',
}

export type Alert = {
  id: string
  message: AlertMessage
  level: AlertLevel
  state: AlertState
  ttl: number
}

const DEFAULT_OPTIONS = {
  level: AlertLevel.Info,
  ttl: 4000,
} as const

export function createAlert(message: AlertMessage, options: AlertOptions = {}): Alert {
  return { id: uniqueId(), message, ...DEFAULT_OPTIONS, ...options, state: AlertState.Opening }
}

export function showAlert(alert: Alert): Alert {
  return { ...alert, state: AlertState.Open }
}

export function hideAlert(alert: Alert): Alert {
  return { ...alert, state: AlertState.Closing }
}

export function isAlertVisible(alert: Alert): boolean {
  return alert.state === AlertState.Open
}
