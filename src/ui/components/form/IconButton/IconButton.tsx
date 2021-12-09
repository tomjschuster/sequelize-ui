import { classnames, toClassname } from '@src/ui/styles/classnames'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: React.ComponentType<SvgProps>
  iconProps?: SvgProps
}

function IconButton({
  label,
  className,
  icon: Icon,
  iconProps,
  ...rest
}: IconButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className={classnames(
        'p-1',
        'hover:bg-gray-200',
        'self-start',
        'ml-0.5',
        toClassname(className),
      )}
      {...rest}
    >
      <Icon title={label} {...iconProps} />
    </button>
  )
}

// Cast is necessary because HOC's don't preserve generics
export default React.memo(IconButton) as typeof IconButton
