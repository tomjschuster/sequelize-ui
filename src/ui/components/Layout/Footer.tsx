import ExternalLink from '@src/ui/routing/ExternalLink'
import RouteLink from '@src/ui/routing/RouteLink'
import { privacyRoute } from '@src/ui/routing/routes'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flexDirection,
  fontSize,
  justifyContent,
  margin,
  padding,
  textColor,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
import React from 'react'

function Footer(): React.ReactElement {
  return (
    <footer
      className={classnames(
        backgroundColor('bg-white', 'dark:bg-gray-900'),
        display('flex'),
        alignItems('xs:items-center'),
        justifyContent('xs:justify-between'),
        flexDirection('flex-col', 'xs:flex-row'),
        padding('px-2', 'py-1'),
      )}
    >
      <span
        className={classnames(textColor('text-black', 'dark:text-gray-200'), fontSize('text-xs'))}
      >
        Copyright &copy; 2023{' '}
        <ExternalLink
          className={classnames(fontSize('text-xs'))}
          href="https://github.com/tomjschuster"
        >
          Tom Schuster
        </ExternalLink>
        .
      </span>
      <RouteLink
        route={privacyRoute()}
        prefetch={false}
        className={classnames(
          margin('mt-1.5', 'xs:mt-0'),
          textColor('hover:text-blue-700', toClassname('dark:hover:text-blue-300')),
          textDecoration('hover:underline'),
          fontSize('text-xs'),
        )}
      >
        Privacy Policy
      </RouteLink>
    </footer>
  )
}

export default Footer
