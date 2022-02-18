import { Classname, classnames, height, width } from '@src/ui/styles/classnames'
import React from 'react'

export type SvgProps = {
  title?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: Classname
  size?: SvgSize
  smSize?: SvgSize
  mdSize?: SvgSize
  lgSize?: SvgSize
}

type SvgSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export default function Svg({
  title,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 1.5,
  size = 4,
  smSize,
  mdSize,
  lgSize,
  className,
  children,
}: React.PropsWithChildren<SvgProps>): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={!title}
      className={classnames(
        height(
          `h-${size}`,
          smSize && `sm:h-${smSize}`,
          mdSize && `md:h-${mdSize}`,
          lgSize && `lg:h-${lgSize}`,
        ),
        width(
          `w-${size}`,
          smSize && `sm:w-${smSize}`,
          mdSize && `md:w-${mdSize}`,
          lgSize && `lg:w-${lgSize}`,
        ),
        className,
      )}
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

// @ts-expect-error needed for tailwind css generation
const _SIZE_CLASSNAMES = [
  'h-1',
  'sm:h-1',
  'md:h-1',
  'lg:h-1',
  'h-2',
  'sm:h-2',
  'md:h-2',
  'lg:h-2',
  'h-3',
  'sm:h-3',
  'md:h-3',
  'lg:h-3',
  'h-4',
  'sm:h-4',
  'md:h-4',
  'lg:h-4',
  'h-5',
  'sm:h-5',
  'md:h-5',
  'lg:h-5',
  'h-6',
  'sm:h-6',
  'md:h-6',
  'lg:h-6',
  'h-7',
  'sm:h-7',
  'md:h-7',
  'lg:h-7',
  'h-8',
  'sm:h-8',
  'md:h-8',
  'lg:h-8',
  'w-1',
  'sm:w-1',
  'md:w-1',
  'lg:w-1',
  'w-2',
  'sm:w-2',
  'md:w-2',
  'lg:w-2',
  'w-3',
  'sm:w-3',
  'md:w-3',
  'lg:w-3',
  'w-4',
  'sm:w-4',
  'md:w-4',
  'lg:w-4',
  'w-5',
  'sm:w-5',
  'md:w-5',
  'lg:w-5',
  'w-6',
  'sm:w-6',
  'md:w-6',
  'lg:w-6',
  'w-7',
  'sm:w-7',
  'md:w-7',
  'lg:w-7',
  'w-8',
  'sm:w-8',
  'md:w-8',
  'lg:w-8',
  'w-9',
  'sm:w-9',
  'md:w-9',
  'lg:w-9',
  'w-10',
  'sm:w-10',
  'md:w-10',
  'lg:w-10',
]
