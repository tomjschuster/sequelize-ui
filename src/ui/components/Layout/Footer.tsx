import {
  backgroundColor,
  boxShadow,
  boxShadowColor,
  classnames,
  fontSize,
  fontWeight,
  margin,
  padding,
  textColor,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'

function Footer(): React.ReactElement {
  return (
    <footer
      className={classnames(
        backgroundColor('bg-white', 'dark:bg-gray-900'),
        flexCenterBetween,
        padding('px-2', 'py-1'),
        boxShadow('shadow-inner'),
        boxShadowColor('dark:shadow-gray-700'),
      )}
    >
      <span
        className={classnames(textColor('text-black', 'dark:text-gray-200'), fontSize('text-xs'))}
      >
        Copyright &copy; {new Date().getFullYear()}{' '}
        <a
          className={classnames(
            textDecoration('hover:underline'),
            textColor('hover:text-blue-700', toClassname('dark:hover:text-blue-300')),
            fontWeight('font-bold'),
            fontSize('text-sm'),
            margin('ml-1.5'),
          )}
          href="https://github.com/tomjschuster"
        >
          Tom Schuster
        </a>
      </span>
    </footer>
  )
}

export default Footer
