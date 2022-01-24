import { classnames, WithClassname } from '@src/ui/styles/classnames'
import { linkBlue } from '@src/ui/styles/utils'
import React, { AnchorHTMLAttributes } from 'react'

export type ExternalLinkProps = WithClassname<AnchorHTMLAttributes<HTMLAnchorElement>> & {
  newTab?: boolean
}

export default function ExternalLink({
  className,
  newTab,
  ...props
}: ExternalLinkProps): React.ReactElement {
  return (
    <a
      className={classnames(linkBlue, className)}
      target={newTab ? '_blank' : props.target}
      rel={newTab ? 'noreferrer' : props.target}
      {...props}
    />
  )
}
