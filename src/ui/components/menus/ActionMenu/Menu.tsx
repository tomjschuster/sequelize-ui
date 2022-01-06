import {
  alignItems,
  backgroundColor,
  Classname,
  classnames,
  cursor,
  display,
  padding,
  width,
} from '@src/ui/styles/classnames'
import { overlayContainer } from '@src/ui/styles/utils'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

export type MenuItem = {
  icon?: React.ComponentType<SvgProps>
  iconProps?: SvgProps
  label: string
  onClick: () => void
}

export type MenuProps = {
  className?: Classname
  style?: React.CSSProperties
  items: MenuItem[]
  isOpen: boolean
  activeIndex?: number
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseOut: () => void
  onMouseOverItem: (index: number) => void
}

function Menu(
  { className, style, items, isOpen, activeIndex, onMouseOut, onMouseOverItem, onClick }: MenuProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      ref={ref}
      role="menu"
      aria-haspopup={true}
      className={classnames(className, overlayContainer, display({ hidden: !isOpen }))}
      style={style}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {items.map(({ icon: Icon, iconProps, label, onClick }, i) => (
        <div
          key={label}
          role="menu-item"
          className={classnames(
            display('flex'),
            alignItems('items-center'),
            cursor('cursor-pointer'),
            padding('pr-4', 'py-1', { 'pl-8': !Icon, 'pl-2': !!Icon }),
            backgroundColor('bg-white', {
              'bg-gray-200': activeIndex === i,
              'hover:bg-gray-200': activeIndex === undefined,
            }),
          )}
          onClick={onClick}
          onMouseOver={() => onMouseOverItem(i)}
        >
          {Icon && (
            <span className={classnames(width('w-6'))}>
              <Icon {...iconProps} />
            </span>
          )}
          {label}
        </div>
      ))}
    </div>
  )
}

export default React.memo(React.forwardRef(Menu))
