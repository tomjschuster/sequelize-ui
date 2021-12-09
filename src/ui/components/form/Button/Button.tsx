import { classnames, toClassname } from '@src/ui/styles/classnames'
import React from 'react'
import { SvgProps } from '../../icons/Svg'
import IconButton from '../IconButton'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ComponentType<SvgProps>
  iconProps?: SvgProps
}

function Button({
  className,
  children,
  icon: Icon,
  iconProps,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={classnames(
        'flex',
        'items-center',
        'justify-center',
        'p-1',
        'border',
        'border-gray-400',
        'rounded',
        'focus:outline-none',
        'focus-visible:border-blue-500',
        'focus-visible:font-bold',
        toClassname(className),
      )}
      {...props}
    >
      {Icon && <Icon {...iconProps} />}
      <span
        className={classnames({
          'text-sm': !IconButton,
          'text-xs': !!IconButton,
          'ml-1': !!IconButton,
        })}
      >
        {children}
      </span>
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(Button) as typeof Button
