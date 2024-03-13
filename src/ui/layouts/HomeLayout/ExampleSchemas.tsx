import { SchemaIconType, SchemaMeta } from '@src/api/meta'
import Markdown from '@src/ui/components/Markdown'
import Modal from '@src/ui/components/Modal'
import IconButton from '@src/ui/components/form/IconButton'
import InfoIcon from '@src/ui/components/icons/Info'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import RouteLink from '@src/ui/routing/RouteLink'
import { goTo } from '@src/ui/routing/navigation'
import { exampleSchemaRoute } from '@src/ui/routing/routes'
import {
  backgroundColor,
  borderRadius,
  classnames,
  fontSize,
  inset,
  lineHeight,
  margin,
  padding,
  position,
  stroke,
  toClassname,
} from '@src/ui/styles/classnames'
import {
  breakWordsMinus16,
  breakWordsMinus8,
  flexCenterVertical,
  panelAction,
  panelGrid,
  title,
} from '@src/ui/styles/utils'
import React from 'react'
import AcademicCapIcon from '../../components/icons/AcademicCapIcon'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type ExampleSchemasProps = {
  exampleMeta: SchemaMeta[]
}

function ExampleSchemas({ exampleMeta }: ExampleSchemasProps): React.ReactElement {
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
      <h2 className={title}>Example Schemas</h2>
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
          title={<ExampleSchemaModalTitle meta={selectedMeta} />}
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
        flexCenterVertical,
        fontSize('text-base'),
        lineHeight('leading-8'),
        backgroundColor('hover:bg-indigo-100', toClassname('dark:hover:bg-indigo-900')),
      )}
    >
      <span className={classnames(margin('mr-2'))}>
        <ExampleSchemaIcon meta={meta} />
      </span>
      <span className={classnames(breakWordsMinus16)}>{meta.displayName}</span>
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
    case SchemaIconType.AcademicCap:
      return <AcademicCapIcon size={6} />
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
        toClassname('-translate-y-1/2'),
      )}
    >
      <IconButton
        onClick={handleClick}
        icon={InfoIcon}
        iconProps={{ size: 6, strokeWidth: 2 }}
        padding={toClassname(padding('p-3'))}
        className={classnames(margin('mr-px'), borderRadius('rounded'), stroke('stroke-current'))}
        label="schema info"
      />
    </div>
  )
}

type ExampleSchemaModalTitleProps = {
  meta: SchemaMeta
}

function ExampleSchemaModalTitle({ meta }: ExampleSchemaModalTitleProps) {
  return (
    <>
      <span className={classnames(margin('mr-2'))}>
        <ExampleSchemaIcon meta={meta} />
      </span>
      <span className={classnames(breakWordsMinus8)}>{meta.displayName} Sample Database</span>
    </>
  )
}

export default React.memo(ExampleSchemas)
