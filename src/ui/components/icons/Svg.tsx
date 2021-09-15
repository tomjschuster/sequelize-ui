import React, { PropsWithChildren } from 'react'

export type SvgProps = {
  title?: string
  fill?: string
  stroke?: string
  className?: string
}

export default function FolderIcon({
  title,
  fill = 'none',
  stroke = 'currentColor',
  className,
  children,
}: PropsWithChildren<SvgProps>): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={fill}
      viewBox="0 0 24 24"
      stroke={stroke}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  )
}
