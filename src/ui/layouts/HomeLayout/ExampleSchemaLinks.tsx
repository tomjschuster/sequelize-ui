import { SchemaIconType, SchemaMeta } from '@src/api/meta'
import RouteLink from '@src/routing/RouteLink'
import { exampleSchemaRoute } from '@src/routing/routes'
import IconButton from '@src/ui/components/form/IconButton'
import InfoIcon from '@src/ui/components/icons/Info'
import Markdown from '@src/ui/components/Markdown'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import {
  backgroundColor,
  classnames,
  fontSize,
  inset,
  margin,
  position,
  translate,
  width,
  zIndex,
} from '@src/ui/styles/classnames'
import { overlayContainer, panelAction, panelGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type ExampleSchemaLinksProps = {
  exampleMeta: SchemaMeta[]
}

function ExampleSchemaLinks({ exampleMeta }: ExampleSchemaLinksProps): React.ReactElement {
  return (
    <ul className={classnames(panelGrid)}>
      {exampleMeta.map((meta) => {
        return (
          <li key={meta.slug} className={classnames(position('relative'))}>
            <ExampleSchemaLink meta={meta} />
            <ExampleSchemaInfoPopover meta={meta} />
          </li>
        )
      })}
    </ul>
  )
}

type ExampleSchemaLinkProps = {
  meta: SchemaMeta
}

function ExampleSchemaLink({ meta }: ExampleSchemaLinkProps): React.ReactElement {
  return (
    <RouteLink
      route={exampleSchemaRoute(meta.slug)}
      prefetch={false}
      className={classnames(
        panelAction,
        fontSize('text-sm'),
        backgroundColor('hover:bg-yellow-50'),
      )}
    >
      <span className={classnames(margin('mr-2'))}>
        <ExampleSchemaIcon meta={meta} />
      </span>
      {meta.displayName}
    </RouteLink>
  )
}

function ExampleSchemaIcon({ meta: { icon } }: ExampleSchemaLinkProps): React.ReactElement {
  switch (icon) {
    case SchemaIconType.Rss:
      return <RssIcon size={6} />
    case SchemaIconType.UserGroup:
      return <UserGroupIcon size={6} />
    case SchemaIconType.Film:
      return <FilmIcon size={6} />
  }
}

function ExampleSchemaInfoPopover({ meta }: { meta: SchemaMeta }): React.ReactElement {
  const { isOpen, toggle } = useIsOpen(false)
  return (
    <div
      className={classnames(
        position('absolute'),
        inset('right-0', 'top-1/2'),
        translate('-translate-y-1/2'),
        margin('mr-2'),
      )}
    >
      <IconButton
        onClick={(evt) => {
          evt.preventDefault()
          toggle()
        }}
        icon={InfoIcon}
        iconProps={{ size: 5, strokeWidth: 2 }}
        label="schema info"
      />
      {isOpen && (
        <div
          className={classnames(
            overlayContainer,
            zIndex('z-10'),
            width('w-96'),
            position('absolute'),
          )}
        >
          <Markdown content={meta.description.join('\n\n')} />
        </div>
      )}
    </div>
  )
}

export default React.memo(ExampleSchemaLinks)
