import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import {
  backgroundColor,
  borderRadius,
  borderWidth,
  boxShadow,
  classnames,
  margin,
  padding,
  textColor,
  toClassname,
  width,
  wordBreak,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'
import { AlertLevel } from '../types'
import { Alert } from './alert'

type AlertDisplayProps = {
  alert: Alert
  onDismiss: (id: string) => void
}

export default function AlertDisplay({ alert, onDismiss }: AlertDisplayProps): React.ReactElement {
  const handleDismiss = React.useCallback(() => onDismiss(alert.id), [alert.id, onDismiss])

  return (
    <p
      className={classnames(
        flexCenterBetween,
        textColor('text-black', 'dark:text-gray-50'),
        padding('pl-2', 'sm:pl-4', 'pr-1', 'py-1'),
        borderRadius('rounded-lg'),
        borderWidth('border'),
        boxShadow('shadow-lg'),
        width('w-full'),
        wordBreak('break-all'),
        toClassname('max-w-[100vw]'),
        backgroundColor({
          'bg-gray-50': alert.level === AlertLevel.Info,
          'bg-green-50': alert.level === AlertLevel.Success,
          'bg-yellow-50': alert.level === AlertLevel.Warning,
          'bg-red-50': alert.level === AlertLevel.Error,
          'dark:bg-gray-800': alert.level === AlertLevel.Info,
          'dark:bg-green-900': alert.level === AlertLevel.Success,
          'dark:bg-yellow-900': alert.level === AlertLevel.Warning,
          'dark:bg-red-900': alert.level === AlertLevel.Error,
        }),
      )}
    >
      {alert.message}
      <button className={classnames(padding('p-1'), margin('ml-2'))} onClick={handleDismiss}>
        <CloseCircleIcon title="dismiss alert" size={6} />
      </button>
    </p>
  )
}
