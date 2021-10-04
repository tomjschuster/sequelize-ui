import React from 'react'
import { classnames } from '../classnames'
import domElements from './domElements'

const cleanTemplate = (classNames: string, inheritedClasses = ''): string =>
  inheritedClasses ? `${classNames} ${inheritedClasses}` : classNames

export type FunctionTemplate<P, E> = (
  ...args: Parameters<typeof classnames>
) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<E>>

interface ClassNameProp {
  className?: string
}
function functionTemplate<P extends ClassNameProp, E = any>(
  Element: React.ComponentType<P>,
): FunctionTemplate<P, E> {
  return (...args: Parameters<typeof classnames>) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef<E, P>((props, ref) => (
      <Element
        {...props}
        ref={ref}
        // eslint-disable-next-line react/prop-types
        className={cleanTemplate(classnames(...args), props.className)}
      />
    ))
}

export type IntrinsicElements = {
  [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], any>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
  <K extends keyof JSX.IntrinsicElements>(acc: IntrinsicElements, DomElement: K) => ({
    ...acc,
    [DomElement]: functionTemplate(
      DomElement as unknown as React.ComponentType<JSX.IntrinsicElements[K]>,
    ),
  }),
  {} as IntrinsicElements,
)

const tw = Object.assign(functionTemplate, intrinsicElements)

export default tw
