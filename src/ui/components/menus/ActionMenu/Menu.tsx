import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  Classname,
  classnames,
  cursor,
  display,
  inset,
  padding,
  position,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

export type MenuItem = {
  icon?: React.ComponentType<SvgProps>
  label: string
  onClick: () => void
}

export type MenuProps = {
  className?: Classname
  items: MenuItem[]
  isOpen: boolean
  activeIndex?: number
  onMouseOut: () => void
  onMouseOverItem: (index: number) => void
}

function Menu({
  className,
  items,
  isOpen,
  activeIndex,
  onMouseOut,
  onMouseOverItem,
}: MenuProps): React.ReactElement {
  return (
    <div
      role="menu"
      aria-haspopup={true}
      className={classnames(
        className,
        position('absolute'),
        inset('top-full', 'right-0'),
        width('w-32'),
        backgroundColor('bg-white'),
        borderWidth('border'),
        borderColor('border-gray-300'),
        borderRadius('rounded'),
        boxShadow('shadow-lg'),
        padding('py-1'),
        display({ hidden: !isOpen }),
      )}
      onMouseOut={onMouseOut}
    >
      {items.map(({ icon: Icon, label, onClick }, i) => (
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
              <Icon />
            </span>
          )}
          {label}
        </div>
      ))}
    </div>
  )
}

export default React.memo(Menu)
