import ExternalLink from '@src/routing/ExternalLink'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flexDirection,
  fontSize,
  justifyContent,
  padding,
  textColor,
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
        Copyright &copy; 2022{' '}
        <ExternalLink
          className={classnames(fontSize('text-xs'))}
          href="https://github.com/tomjschuster"
        >
          Tom Schuster
        </ExternalLink>
        .
      </span>
    </footer>
  )
}

export default Footer
