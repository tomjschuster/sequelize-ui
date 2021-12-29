import {
  backgroundColor,
  boxShadow,
  classnames,
  fontSize,
  fontWeight,
  margin,
  padding,
  textColor,
  textDecoration,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'

function Footer(): React.ReactElement {
  return (
    <footer
      className={classnames(
        flexCenterBetween,
        padding('px-2', 'py-1'),
        backgroundColor('bg-indigo-50'),
        boxShadow('shadow-inner'),
      )}
    >
      <span className={classnames(fontSize('text-xs'))}>
        Copyright &copy; {new Date().getFullYear()}
        <a
          className={classnames(
            textDecoration('hover:underline'),
            textColor('hover:text-blue-700'),
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
