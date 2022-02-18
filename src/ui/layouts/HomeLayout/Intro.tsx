import SequelizeUiLogo from '@src/ui/components/SequelizeUiLogo'
import {
  classnames,
  display,
  flexDirection,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  margin,
  maxWidth,
  textAlign,
  width,
} from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import React from 'react'

export default function Intro(): React.ReactElement {
  return (
    <div className={classnames(margin('mb-6'))}>
      <h2
        className={classnames(
          flexCenter,
          flexDirection('flex-col-reverse', 'xs:flex-row'),
          fontSize('text-3xl', '2xs:text-4xl', 'xs:text-5xl'),
          letterSpacing('tracking-wider'),
          fontWeight('font-semibold'),
          textAlign('text-center'),
          margin('my-6'),
        )}
      >
        <SequelizeUiLogo
          className={classnames(
            margin('mt-2', 'xs:mt-0'),
            display('inline'),
            height('h-16', 'xs:h-20'),
            width('w-16', 'xs:w-20'),
          )}
        />
        <span className={classnames(display('inline-block'))}>Sequelize UI</span>
      </h2>

      <p
        className={classnames(
          maxWidth('max-w-md'),
          margin('mx-auto'),
          fontSize('text-lg', '2xs:text-xl', 'xs:text-2xl'),
          textAlign('text-center'),
        )}
      >
        Generate Sequelize code in TypeScript for any database, with any configuration.
      </p>
    </div>
  )
}
