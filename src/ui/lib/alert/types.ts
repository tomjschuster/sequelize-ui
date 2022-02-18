import React from 'react'

export type AlertMessage = React.ReactNode | string

export enum AlertLevel {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export type AlertOptions = {
  level?: AlertLevel
  ttl?: number
}
