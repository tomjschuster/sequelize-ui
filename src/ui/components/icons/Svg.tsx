import { classnames, height, toClassname, width } from '@src/ui/styles/classnames'
import React from 'react'

export type SvgProps = {
  title?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
  size?: SvgSize
}

type SvgSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// @ts-expect-error needed for tailwind css generation
const _SIZE_CLASSNAMES = [
  'h-1',
  'h-2',
  'h-3',
  'h-4',
  'h-5',
  'h-6',
  'h-7',
  'h-8',
  'w-1',
  'w-2',
  'w-3',
  'w-4',
  'w-5',
  'w-6',
  'w-7',
  'w-8',
]

export default function Svg({
  title,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 1.5,
  size = 4,
  className,
  children,
}: React.PropsWithChildren<SvgProps>): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classnames(height(`h-${size}`), width(`w-${size}`), toClassname(className))}
      fill={fill}
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  )
}

export function withSvg<P>(
  Component: React.ComponentType<P>,
  overrides: Partial<SvgProps> = {},
): React.ComponentType<P & SvgProps> {
  class WithSvg extends React.Component<P & SvgProps> {
    static displayName?: string
    render(): React.ReactElement {
      return (
        <Svg {...this.props} {...overrides}>
          <Component {...this.props} />
        </Svg>
      )
    }
  }

  WithSvg.displayName = `WithSvg${Component.displayName || Component.name || 'Component'}`
  return WithSvg
}
