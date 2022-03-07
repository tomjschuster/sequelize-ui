import useDarkMode from '@src/ui/hooks/useDarkMode'
import useDidMount from '@src/ui/hooks/useDidMount'
import RouteLink from '@src/ui/routing/RouteLink'
import { indexRoute } from '@src/ui/routing/routes'
import {
  alignItems,
  backgroundColor,
  boxShadow,
  boxShadowColor,
  classnames,
  display,
  fill,
  fontSize,
  height,
  justifyContent,
  margin,
  padding,
  textColor,
  toClassname,
  transitionDuration,
  transitionProperty,
  width,
  zIndex,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import React from 'react'
import ComputerIcon from '../icons/Computer'
import GitHubIcon from '../icons/GitHub'
import MoonIcon from '../icons/Moon'
import SunIcon from '../icons/Sun'
import Menu from '../menus/Menu'
import SequelizeUiLogo from '../SequelizeUiLogo'

type HeaderProps = {
  compact: boolean
}

function Header({ compact }: HeaderProps): React.ReactElement {
  const { setDarkMode, isExplicit } = useDarkMode()
  const mounted = useDidMount()

  const items = React.useMemo(
    () => [
      {
        label: 'System',
        icon: ComputerIcon,
        onClick: () => setDarkMode(null),
      },
      {
        label: 'Light',
        icon: SunIcon,
        onClick: () => setDarkMode(false),
      },
      {
        label: 'Dark',
        icon: MoonIcon,
        onClick: () => setDarkMode(true),
      },
    ],
    [setDarkMode],
  )

  return (
    <header
      className={classnames(
        zIndex('z-20'),
        backgroundColor('bg-white', 'dark:bg-gray-900'),
        boxShadow('shadow'),
        boxShadowColor('dark:shadow-gray-700'),
        padding('p-1', { 'sm:p-2': !compact }),
        display('flex'),
        alignItems('items-center'),
        justifyContent('justify-between'),
      )}
    >
      <RouteLink
        route={indexRoute()}
        prefetch={false}
        title="Go to Sequelize UI Home"
        className={classnames(display('inline-block'))}
      >
        <h1
          className={classnames(
            fontSize('text-xl', { 'sm:text-2xl': !compact }),
            textColor('text-black', 'dark:text-gray-200'),
            display('flex'),
            alignItems('items-center'),
          )}
        >
          <SequelizeUiLogo className={classnames(display('inline'), height('h-8'), width('w-8'))} />
          Sequelize UI
        </h1>
      </RouteLink>
      <div className={classnames(flexCenter, margin('mr-2'))}>
        <a
          title="GitHub"
          className={classnames(textColor('hover:text-blue-700'))}
          href="https://github.com/tomjschuster/sequelize-ui"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon
            size={8}
            className={classnames(
              fill(
                'fill-black',
                toClassname('hover:fill-indigo-600'),
                toClassname('dark:fill-gray-200'),
                toClassname('dark:hover:fill-indigo-400'),
                transitionProperty('transition-colors'),
                transitionDuration('duration-300'),
              ),
            )}
          />
        </a>
        <Menu
          className={classnames(margin('ml-4'))}
          buttonClassName={classnames(
            boxShadow({ shadow: isExplicit }),
            boxShadowColor('shadow-indigo-200'),
          )}
          items={items}
          title="Appearance"
          aria-label="appearance"
        >
          <div className={classnames(display({ hidden: mounted }), width('w-6'), height('h-6'))} />
          <MoonIcon
            className={classnames(
              display('hidden', { 'dark:block': mounted }),
              textColor({ 'text-indigo-500': isExplicit, 'dark:text-indigo-300': isExplicit }),
            )}
            size={6}
          />
          <SunIcon
            className={classnames(
              display('dark:hidden', { hidden: !mounted, block: mounted }),
              textColor({ 'text-orange-700': isExplicit, 'dark:text-indigo-800': isExplicit }),
            )}
            size={6}
          />
        </Menu>
      </div>
    </header>
  )
}

export default Header
