import breadcrumbs from '@src/ui/styles/breadcrumbs.module.css'
import {
  classnames,
  display,
  fontSize,
  fontWeight,
  margin,
  maxWidth,
  textAlign,
  textDecoration,
  toClassname,
  wordBreak,
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
    <div className={classnames(margin('mb-4'), fontSize('text-sm'))}>
      {items.map(({ label, onClick }) => (
        <button
          key={label}
          className={classnames(
            display('inline-block'),
            fontWeight('font-semibold'),
            textDecoration('hover:underline'),
            textAlign('text-left'),
            toClassname(breadcrumbs.breadcrumb),
            wordBreak('break-words'),
            maxWidth('max-w-full'),
          )}
          onClick={onClick}
        >
          {label}
        </button>
      ))}
      <span
        className={classnames(
          wordBreak('break-words'),
          display('inline-block'),
          textAlign('text-left'),
          maxWidth('max-w-full'),
        )}
      >
        {current}
      </span>
    </div>
  )
}

export default React.memo(Breadcrumbs)
