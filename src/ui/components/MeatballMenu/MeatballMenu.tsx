import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
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
  height,
  inset,
  padding,
  position,
  space,
  transitionProperty,
  width,
} from '@src/ui/styles/classnames'
import { flexCenterColumn } from '@src/ui/styles/utils'
import { Key } from '@src/utils/dom'
import { Override } from '@src/utils/types'
import React, { ButtonHTMLAttributes } from 'react'
import { SvgProps } from '../icons/Svg'

const dot = classnames(
  display('block'),
  width('w-1'),
  height('h-1'),
  borderRadius('rounded-full'),
  backgroundColor('bg-gray-700', 'hover:bg-black'),
)

export type MenuItem = {
  icon?: React.ComponentType<SvgProps>
  label: string
  onClick: () => void
}

type MeatballMenuProps = Override<
  ButtonHTMLAttributes<HTMLButtonElement>,
  { className?: Classname; items: MenuItem[] }
>

function MeatballMenu({
  className,
  onClick,
  items,
  ...props
}: MeatballMenuProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const [open, setOpen] = React.useState<boolean>(false)
  const [activeIndex, setActiveIndex] = React.useState<number>()

  const activeItem = React.useMemo(
    () => (activeIndex !== undefined ? items[activeIndex] : undefined),
    [items, activeIndex],
  )

  const close = React.useCallback(() => {
    setOpen(false)
    setActiveIndex(undefined)
  }, [])

  useOnClickOutside(ref, close)

  const handleClick = React.useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      setOpen((x) => !x)
      setActiveIndex(undefined)
      if (onClick) onClick(evt)
    },
    [onClick],
  )

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent): void => {
      if (!open) return

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

        default:
      }
    },
    [open, activeItem, items.length],
  )

  return (
    <div ref={ref} className={classnames(className)}>
      <div className={classnames(position('relative'))}>
        <button
          aria-haspopup={true}
          aria-expanded={open}
          title="Actions"
          aria-label="actions"
          className={classnames(
            flexCenterColumn,
            transitionProperty('transition'),
            width('w-8'),
            height('h-8'),
            space('space-y-0.5'),
            borderRadius('rounded-full'),
            padding('p-2'),
            cursor('cursor-pointer'),
            backgroundColor({ 'bg-gray-300': open, 'hover:bg-gray-200': !open }),
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onBlur={close}
          {...props}
        >
          <span className={classnames(dot)} />
          <span className={classnames(dot)} />
          <span className={classnames(dot)} />
        </button>
        {items.length > 0 && (
          <div
            role="menu"
            aria-haspopup={true}
            className={classnames(
              position('absolute'),
              inset('top-full', 'right-0'),
              width('w-32'),
              backgroundColor('bg-white'),
              borderWidth('border'),
              borderColor('border-gray-300'),
              borderRadius('rounded'),
              boxShadow('shadow-lg'),
              padding('py-1'),
              display({ hidden: !open }),
            )}
            onMouseOut={() => setActiveIndex(undefined)}
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
                onMouseOver={() => setActiveIndex(i)}
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
        )}
      </div>
    </div>
  )
}

export default React.memo(MeatballMenu)
