import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import {
  classnames,
  display,
  flexWrap,
  fontSize,
  fontWeight,
  margin,
  textAlign,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
import { breakWords } from '@src/ui/styles/utils'
import React from 'react'

export type Breadcrumb = {
  label: string
  onClick: () => void
}

type BreadcrumbsProps = {
  items: Breadcrumb[]
  current: string
}

function Breadcrumbs({ items, current }: BreadcrumbsProps): React.ReactElement {
  return (
    <div
      className={classnames(
        margin('mb-4'),
        display('flex'),
        flexWrap('flex-wrap'),
        fontSize('text-sm'),
      )}
    >
      {items.map(({ label, onClick }) => (
        <button
          key={label}
          className={classnames(
            fontWeight('font-semibold'),
            textDecoration('hover:underline'),
            textAlign('text-left'),
            toClassname(breadcrumbs.breadcrumb),
            breakWords,
          )}
          onClick={onClick}
        >
          {label}
        </button>
      ))}
      <span className={classnames(breakWords, textAlign('text-left'))}>{current}</span>
    </div>
  )
}

export default React.memo(Breadcrumbs)
