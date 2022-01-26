import RouteLink from '@src/routing/RouteLink'
import { indexRoute } from '@src/routing/routes'
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
import { useDarkMode } from '../DarkMode'
import ComputerIcon from '../icons/Computer'
import GitHubIcon from '../icons/GitHub'
import MoonIcon from '../icons/Moon'
import SunIcon from '../icons/Sun'
import Menu from '../menus/Menu'

type HeaderProps = {
  compact: boolean
}

function Header({ compact }: HeaderProps): React.ReactElement {
  const { darkMode, setDarkMode, isExplicit } = useDarkMode()

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
    [],
  )

  return (
    <header
      className={classnames(
        zIndex('z-20'),
        backgroundColor('bg-white', 'dark:bg-gray-900'),
        boxShadow('shadow'),
        boxShadowColor('dark:shadow-gray-700'),
        padding('p-0.5', { 'sm:p-2': !compact }),
        display('flex'),
        alignItems('items-center'),
        justifyContent('justify-between'),
      )}
    >
      <RouteLink
        route={indexRoute()}
        title="Go to Sequelize UI Home"
        className={classnames(display('inline-block'))}
      >
        <h1
          className={classnames(
            fontSize({ 'text-xl': !compact, 'sm:text-2xl': !compact, 'text-lg': compact }),
            textColor('text-black', 'dark:text-gray-200'),
            display('flex'),
            alignItems('items-center'),
          )}
        >
          <img
            width="50px"
            height="50px"
            className={classnames(
              display('inline'),
              height({ 'h-6': !compact, 'sm:h-8': !compact, 'h-5': compact }),
              width({ 'w-6': !compact, 'sm:w-8': !compact, 'w-5': compact }),
              margin('mx-2'),
            )}
            alt=""
            src="/images/sequelize-ui-logo-small.svg"
          />
          Sequelize UI
        </h1>
      </RouteLink>
      <div
        className={classnames(flexCenter, margin('mr-2'), padding('py-1', { 'sm:py-0': !compact }))}
      >
        <a
          title="GitHub"
          className={classnames(padding('px-2'), textColor('hover:text-blue-700'))}
          href="https://github.com/tomjschuster/sequelize-ui"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon
            size={compact ? 6 : 8}
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
          className={classnames(margin({ 'ml-1': compact, 'ml-2': !compact }))}
          buttonClassName={classnames(
            boxShadow({ shadow: isExplicit }),
            boxShadowColor('shadow-indigo-200'),
          )}
          items={items}
          title="Appearance"
          aria-label="appearance"
        >
          {darkMode ? (
            <MoonIcon
              className={classnames(
                textColor({ 'text-indigo-500': isExplicit, 'dark:text-indigo-300': isExplicit }),
              )}
              size={compact ? 4 : 6}
            />
          ) : (
            <SunIcon
              className={classnames(
                textColor({ 'text-orange-700': isExplicit, 'dark:text-indigo-800': isExplicit }),
              )}
              size={compact ? 4 : 6}
            />
          )}
        </Menu>
      </div>
    </header>
  )
}

export default Header
