import { classnames, fontSize, textColor } from '@src/ui/styles/classnames'
import React from 'react'

type FormErrorProps = {
  id: string
  error: string | undefined
}

function FormError({ id, error }: FormErrorProps): React.ReactElement {
  return (
    <span
      id={id}
      className={classnames(textColor('text-red-700', 'dark:text-red-300'), fontSize('text-xs'))}
      role={error ? 'alert' : undefined}
      aria-hidden={!error}
    >
      {error}
    </span>
  )
}

export default React.memo(FormError)
