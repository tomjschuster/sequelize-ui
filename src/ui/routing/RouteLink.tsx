import { classnames, WithClassname } from '@src/ui/styles/classnames'
import { Override } from '@src/utils/types'
import Link, { LinkProps } from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'
import { Route, routeToUrl } from './routes'

export type RouteLinkProps = Omit<
  Override<WithClassname<AnchorHTMLAttributes<HTMLAnchorElement>>, LinkProps>,
  'href'
> & { route: Route }

export default function RouteLink({
  route,
  className,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  ...props
}: RouteLinkProps): React.ReactElement {
  return (
    <Link
      legacyBehavior
      href={routeToUrl(route)}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
    >
      <a className={classnames(className)} {...props} />
    </Link>
  )
}
