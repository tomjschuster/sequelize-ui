import {
  alignItems,
  backgroundColor,
  Classname,
  classnames,
  cursor,
  display,
  padding,
  TBackgroundColor,
  width,
} from '@src/ui/styles/classnames'
import { MediaQuery, overlayContainer } from '@src/ui/styles/utils'
import React from 'react'
import { SvgProps } from '../../icons/Svg'

export type MenuItem = {
  ref?: React.RefObject<HTMLDivElement>
  icon?: React.ComponentType<SvgProps>
  iconProps?: SvgProps
  label: string
  hideAboveQuery?: MediaQuery
  hidden?: boolean
  onClick: () => void
}

export type MenuPanelProps = {
  className?: Classname
  style?: React.CSSProperties
  items: MenuItem[]
  isOpen: boolean
  activeIndex?: number
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseOut: () => void
  onMouseOverItem: (index: number) => void
}

function MenuPanel(
  {
    className,
    style,
    items,
    isOpen,
    activeIndex,
    onMouseOut,
    onMouseOverItem,
    onClick,
  }: MenuPanelProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      ref={ref}
      role="menu"
      className={classnames(className, overlayContainer, display({ hidden: !isOpen }))}
      style={style}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {items.map(
        ({ icon: Icon, ref, iconProps, label, hideAboveQuery, hidden, onClick }, i) =>
          !hidden && (
            <div
              ref={ref}
              key={label}
              role="menu-item"
              className={classnames(
                display('flex', hideAboveQuery && `${hideAboveQuery}:hidden`),
                alignItems('items-center'),
                cursor('cursor-pointer'),
                padding('pr-4', 'py-1', { 'pl-8': !Icon, 'pl-2': !!Icon }),
                backgroundColor({
                  'bg-gray-200': activeIndex === i,
                  'hover:bg-gray-200': activeIndex === undefined,
                  'dark:bg-gray-700': activeIndex === i,
                  ['dark:hover:bg-gray-700' as TBackgroundColor]: activeIndex === undefined,
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
          ),
      )}
    </div>
  )
}

export default React.memo(React.forwardRef(MenuPanel))
