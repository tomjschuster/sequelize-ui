import {
  classnames,
  display,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  margin,
  maxWidth,
  textAlign,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'

export default function Intro(): React.ReactElement {
  return (
    <div className={classnames(margin('mb-6'))}>
      <h2
        className={classnames(
          fontSize('text-3xl', '2xs:text-4xl', 'xs:text-5xl'),
          letterSpacing('tracking-wider'),
          fontWeight('font-semibold'),
          textAlign('text-center'),
          margin('my-6'),
        )}
      >
        <img
          width="100px"
          height="100px"
          className={classnames(display('inline'), height('h-12'), width('w-12'), margin('mr-4'))}
          alt=""
          src="/images/sequelize-ui-logo-small.svg"
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
