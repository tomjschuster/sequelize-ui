import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import {
  Classname,
  classnames,
  inset,
  position,
  toClassname,
  verticalAlign,
  WithClassname,
  zIndex,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import { Key } from '@src/utils/dom'
import React, { ButtonHTMLAttributes } from 'react'
import MenuButton from '../MenuButton'
import MenuPanel, { MenuItem } from '../MenuPanel'

export type MenuProps = WithClassname<
  ButtonHTMLAttributes<HTMLButtonElement> & { buttonClassName?: Classname; items: MenuItem[] }
>

function Menu({
  className,
  buttonClassName,
  onClick,
  items,
  ...props
}: MenuProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [activeIndex, setActiveIndex] = React.useState<number>()

  const activeItem = React.useMemo(
    () => (activeIndex !== undefined ? items[activeIndex] : undefined),
    [items, activeIndex],
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
    setActiveIndex(undefined)
  }, [])

  useOnClickOutside(ref, close)

  const handleClick = React.useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen((x) => !x)
      setActiveIndex(undefined)
      if (onClick) onClick(evt)
    },
    [onClick],
  )

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent): void => {
      if (!isOpen) return

      if ([Key.ArrowUp, Key.ArrowDown, Key.Home, Key.End].some((key) => key === evt.key)) {
        evt.preventDefault()
        evt.stopPropagation()
      }

      switch (evt.key) {
        case Key.Enter:
          return activeItem?.onClick()

        case Key.ArrowUp:
          return setActiveIndex((i) => (i ? i - 1 : items.length - 1))

        case Key.ArrowDown:
          return setActiveIndex((i) => (i === undefined || i == items.length - 1 ? 0 : i + 1))

        case Key.Home:
          return setActiveIndex(0)

        case Key.End:
          return setActiveIndex(items.length - 1)

        case Key.Escape:
        case Key.Tab:
          return close()

        default:
      }
    },
    [isOpen, close, activeItem, items.length],
  )

  return (
    <div ref={ref} className={classnames(className)}>
      <div className={classnames(position('relative', flexCenter))}>
        <MenuButton
          className={classnames(buttonClassName, verticalAlign('align-middle'))}
          isActive={isOpen}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          {...props}
        />
        <MenuPanel
          className={classnames(
            position('absolute'),
            inset('right-0', toClassname('top-[calc(100%+theme(space.2))]')),
            zIndex('z-20'),
          )}
          activeIndex={activeIndex}
          items={items}
          isOpen={isOpen}
          onMouseOverItem={setActiveIndex}
          onMouseOut={() => setActiveIndex(undefined)}
          onClick={close}
        />
      </div>
    </div>
  )
}

export default React.memo(Menu)
