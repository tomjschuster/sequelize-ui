import { classnames, height, padding, space, width } from '@src/ui/styles/classnames'
import { flexCenterColumn } from '@src/ui/styles/utils'
import React from 'react'
import Menu, { MenuProps } from '../Menu'
import Dot from './Dot'

type ActionMenuProps = Omit<MenuProps, 'children'> & { small?: boolean }

function ActionMenu({
  className,
  onClick,
  items,
  small,
  ...props
}: ActionMenuProps): React.ReactElement {
  return (
    <Menu
      className={className}
      onClick={onClick}
      items={items}
      title="Actions"
      aria-label="actions"
      {...props}
    >
      <Dots small={small} />
    </Menu>
  )
}

function Dots({ small }: { small?: boolean }): React.ReactElement {
  return (
    <span
      className={classnames(
        flexCenterColumn,
        width({ 'w-6': small, 'w-8': !small }),
        height({ 'h-6': small, 'h-8': !small }),
        space('space-y-0.5'),
        padding('px-1'),
      )}
    >
      <Dot />
      <Dot />
      <Dot />
    </span>
  )
}

export default React.memo(ActionMenu)
