import { SchemaIconType, SchemaMeta } from '@src/api/meta'
import { goTo } from '@src/routing/navigation'
import RouteLink from '@src/routing/RouteLink'
import { exampleSchemaRoute } from '@src/routing/routes'
import IconButton from '@src/ui/components/form/IconButton'
import InfoIcon from '@src/ui/components/icons/Info'
import Markdown from '@src/ui/components/Markdown'
import Modal from '@src/ui/components/Modal'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import {
  backgroundColor,
  borderRadius,
  classnames,
  fontSize,
  inset,
  margin,
  padding,
  position,
  toClassname,
  translate,
} from '@src/ui/styles/classnames'
import { breakWordsMinus24, breakWordsMinus8, panelAction, panelGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type ExampleSchemaLinksProps = {
  exampleMeta: SchemaMeta[]
}

function ExampleSchemaLinks({ exampleMeta }: ExampleSchemaLinksProps): React.ReactElement {
  const { isOpen, open, close } = useIsOpen(false)
  const [selectedMeta, setSelectedMeta] = React.useState<SchemaMeta | undefined>(exampleMeta[0])

  const selectMeta = React.useCallback(
    (meta: SchemaMeta) => {
      setSelectedMeta(meta)
      open()
    },
    [open],
  )

  const handleConfirm = React.useCallback(
    () => selectedMeta && goTo(exampleSchemaRoute(selectedMeta.slug)),
    [selectedMeta],
  )

  return (
    <>
      <ul className={classnames(panelGrid)}>
        {exampleMeta.map((meta) => {
          return (
            <li key={meta.slug} className={classnames(position('relative'))}>
              <ExampleSchemaLink meta={meta} />
              <ExampleSchemaInfo meta={meta} onClick={selectMeta} />
            </li>
          )
        })}
      </ul>
      {selectedMeta && (
        <Modal
          id="example-schema-info"
          title={
            <>
              <span className={classnames(margin('mr-2'))}>
                <ExampleSchemaIcon meta={selectedMeta} />
              </span>
              <span className={classnames(breakWordsMinus8)}>
                {selectedMeta.displayName} Sample Database
              </span>
            </>
          }
          isOpen={isOpen}
          confirmText="View code"
          onConfirm={handleConfirm}
          onClose={close}
        >
          <Markdown content={selectedMeta.description.join('\n\n')} />
        </Modal>
      )}
    </>
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
      <span className={classnames(breakWordsMinus24)}>{meta.displayName}</span>
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

function ExampleSchemaInfo({
  meta,
  onClick,
}: {
  meta: SchemaMeta
  onClick: (meta: SchemaMeta) => void
}): React.ReactElement {
  const handleClick = React.useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault()
      onClick(meta)
    },
    [meta, onClick],
  )

  return (
    <div
      className={classnames(
        position('absolute'),
        inset('right-0', 'top-1/2'),
        translate('-translate-y-1/2'),
      )}
    >
      <IconButton
        onClick={handleClick}
        icon={InfoIcon}
        iconProps={{ size: 5, strokeWidth: 2 }}
        padding={toClassname(padding('p-2.5'))}
        className={classnames(margin('mr-px'), borderRadius('rounded'))}
        label="schema info"
      />
    </div>
  )
}

export default React.memo(ExampleSchemaLinks)
