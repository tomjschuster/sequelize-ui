import { SchemaIconType, SchemaMeta } from '@src/api/meta'
import { goTo } from '@src/routing/navigation'
import RouteLink from '@src/routing/RouteLink'
import { exampleSchemaRoute } from '@src/routing/routes'
import Button from '@src/ui/components/form/Button'
import IconButton from '@src/ui/components/form/IconButton'
import CloseIcon from '@src/ui/components/icons/Close'
import InfoIcon from '@src/ui/components/icons/Info'
import Markdown from '@src/ui/components/Markdown'
import Portal from '@src/ui/components/Portal'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import { useTrapFocus } from '@src/ui/lib/focus'
import {
  alignItems,
  backgroundColor,
  backgroundOpacity,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  classnames,
  display,
  flexDirection,
  fontSize,
  inset,
  justifyContent,
  margin,
  maxWidth,
  minWidth,
  overflow,
  padding,
  position,
  textColor,
  toClassname,
  translate,
  width,
} from '@src/ui/styles/classnames'
import { panelAction, panelGrid, subtitle } from '@src/ui/styles/utils'
import { Key } from '@src/utils/dom'
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
        <Portal>
          <Modal
            id="example-schema-info"
            title={
              <>
                <span className={classnames(margin('mr-2'))}>
                  <ExampleSchemaIcon meta={selectedMeta} />
                </span>
                {selectedMeta.displayName} Sample Database
              </>
            }
            isOpen={isOpen}
            confirmText="View code"
            onConfirm={handleConfirm}
            onClose={close}
          >
            <Markdown
              content={selectedMeta.description
                .concat(selectedMeta.description)
                .concat(selectedMeta.description)
                .join('\n\n')}
            />
          </Modal>
        </Portal>
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
        margin('mr-2'),
      )}
    >
      <IconButton
        onClick={handleClick}
        icon={InfoIcon}
        iconProps={{ size: 5, strokeWidth: 2 }}
        label="schema info"
      />
    </div>
  )
}

const MODAL_LABEL = 'modal-label'

type ModalProps = React.PropsWithChildren<{
  id: string
  title: React.ReactNode
  isOpen: boolean
  confirmText?: string
  onConfirm?: () => void
  onClose: () => void
}>

function Modal({
  id,
  title,
  isOpen,
  confirmText = 'OK',
  onConfirm,
  onClose,
  children,
}: ModalProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  useLockScroll(ref)
  useTrapFocus({ ref, skip: !isOpen })

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent): void => {
      if (!isOpen && evt.key === Key.Escape) {
        onClose()
      }
    },
    [isOpen, onClose],
  )

  return (
    <div
      className={classnames(
        display({ block: isOpen, hidden: !isOpen }),
        position('fixed'),
        backgroundColor('bg-black'),
        backgroundOpacity('!bg-opacity-30'),
        inset('top-0', 'right-0', 'bottom-0', 'left-0'),
      )}
    >
      <div
        className={classnames(
          position('fixed'),
          inset('top-0', 'bottom-0', 'sm:top-8', 'sm:bottom-8', 'sm:left-1/2'),
          translate('sm:-translate-x-1/2'),
          overflow('overflow-y-auto'),
          width('w-full'),
          toClassname('sm:w-[theme(screens.sm)]'),
          toClassname('sm:max-w-[calc(100vw-theme(space.16))]'),
        )}
      >
        <div
          ref={ref}
          role="dialog"
          id={id}
          aria-labelledby={MODAL_LABEL}
          aria-modal={true}
          className={classnames(
            display({ hidden: !isOpen }),
            backgroundColor('bg-white'),
            position('absolute'),
            maxWidth('max-w-full'),

            padding('p-4'),
            borderWidth('border'),
            borderColor('sm:border-blue-600'),
            borderRadius('sm:rounded'),
            boxShadow('shadow-xl'),
          )}
          onKeyDown={handleKeyDown}
          onClick={(evt) => evt.stopPropagation()}
        >
          <h2
            id={MODAL_LABEL}
            className={classnames(
              subtitle,
              display('flex'),
              alignItems('items-center'),
              toClassname('w-[calc(100%-theme(space.11))]'),
            )}
          >
            {title}
          </h2>

          <div className={classnames(margin('my-4'))}>{children}</div>
          <div
            className={classnames(
              display('flex'),
              flexDirection('flex-col', 'sm:flex-row'),
              justifyContent('justify-end'),
            )}
          >
            <Button
              className={classnames(
                minWidth('min-w-28'),
                width('w-full', 'sm:w-auto'),
                maxWidth('max-w-full'),
              )}
              onClick={onClose}
            >
              Close
            </Button>
            {onConfirm && (
              <Button
                className={classnames(
                  margin('ml-0', 'mt-4', 'sm:mt-0', 'sm:ml-4'),
                  minWidth('min-w-28'),
                  width('w-full', 'sm:w-auto'),
                  maxWidth('max-w-full'),
                  textColor('text-white'),
                  backgroundColor('bg-blue-600', 'hover:bg-blue-400'),
                )}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
          <IconButton
            className={classnames(
              position('absolute'),
              inset('top-0', 'right-0'),
              margin('mt-2', 'mr-2'),
            )}
            icon={CloseIcon}
            iconProps={{ size: 6, strokeWidth: 2 }}
            label="close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(ExampleSchemaLinks)
