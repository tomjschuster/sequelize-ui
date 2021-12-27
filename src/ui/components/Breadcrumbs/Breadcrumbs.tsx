import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import {
  classnames,
  display,
  flexWrap,
  fontSize,
  fontWeight,
  margin,
  textDecoration,
  toClassname,
} from '@src/ui/styles/classnames'
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
            toClassname(breadcrumbs.breadcrumb),
          )}
          onClick={onClick}
        >
          {label}
        </button>
      ))}
      <span>{current}</span>
    </div>
  )
}

export default React.memo(Breadcrumbs)
