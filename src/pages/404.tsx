import withLayout from '@src/ui/hocs/withLayout'
import {
  borderColor,
  borderWidth,
  classnames,
  display,
  flex,
  fontSize,
  fontWeight,
  padding,
  verticalAlign,
} from '@src/ui/styles/classnames'
import { backgroundWhite, flexCenterColumn, fontColor } from '@src/ui/styles/utils'
import React from 'react'

function NotFound(): React.ReactElement {
  return (
    <div className={classnames(fontColor, backgroundWhite, flexCenterColumn, flex('flex-1'))}>
      <div>
        <h1
          className={classnames(
            display('inline-block'),
            borderWidth('border-r-2'),
            borderColor('border-r-gray-500'),
            padding('p-4'),
            verticalAlign('align-top'),
            fontSize('text-xl'),
            fontWeight('font-bold'),
          )}
        >
          404
        </h1>

        <div
          className={classnames(
            display('inline-block'),
            padding('p-4'),
            verticalAlign('align-top'),
          )}
        >
          <h2 className={classnames(fontSize('text-base'))}>This page could not be found.</h2>
        </div>
      </div>
    </div>
  )
}

export default withLayout(() => ({
  title: 'Sequelize UI | Not Found',
}))(NotFound)
