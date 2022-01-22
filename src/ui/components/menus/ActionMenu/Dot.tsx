import {
  backgroundColor,
  borderRadius,
  classnames,
  display,
  height,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'

export default function Dot() {
  return (
    <span
      className={classnames(
        display('block'),
        width('w-1'),
        height('h-1'),
        borderRadius('rounded-full'),
        backgroundColor('bg-gray-700', 'dark:bg-gray-300'),
      )}
    />
  )
}
