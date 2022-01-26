import Button from '@src/ui/components/form/Button'
import IconButton from '@src/ui/components/form/IconButton'
import CloseIcon from '@src/ui/components/icons/Close'
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
  inset,
  justifyContent,
  margin,
  maxWidth,
  minWidth,
  outlineStyle,
  overflow,
  padding,
  position,
  toClassname,
  width,
  zIndex,
} from '@src/ui/styles/classnames'
import {
  backgroundWhite,
  breakWordsMinus8,
  fontColor,
  fullscreen,
  subtitle,
} from '@src/ui/styles/utils'
import { Key } from '@src/utils/dom'
import React from 'react'
import ErrorBoundary from '../ErrorBoundary'
import Portal from '../Portal'

export const MODAL_PORTAL_ID = 'modal-container'

function modalLabel(id: string): string {
  return `modal-label-${id}`
}

export type ModalProps = React.PropsWithChildren<{
  id: string
  title: React.ReactNode
  isOpen: boolean
  confirmDestructive?: boolean
  confirmText?: string
  onConfirm?: () => void
  onClose: () => void
}>

function Modal({
  id,
  title,
  isOpen,
  confirmText = 'OK',
  confirmDestructive = false,
  onConfirm,
  onClose,
  children,
}: ModalProps): React.ReactElement {
  return (
    <Portal id={MODAL_PORTAL_ID}>
      <ModalBackdrop isOpen={isOpen} onClose={onClose}>
        <Dialog id={id} isOpen={isOpen}>
          <ErrorBoundary wrapper={ErrorWrapper}>
            <Title id={id} isOpen={isOpen}>
              {title}
            </Title>
            <Content>{children}</Content>
            <Actions
              confirmText={confirmText}
              confirmDestructive={confirmDestructive}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          </ErrorBoundary>
          <CloseButton onClose={onClose} />
        </Dialog>
      </ModalBackdrop>
    </Portal>
  )
}

type ModalBackdropProps = React.PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
}>

function ModalBackdrop({ isOpen, children, onClose }: ModalBackdropProps): React.ReactElement {
  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent): void => {
      if (isOpen && evt.key === Key.Escape) {
        onClose()
      }
    },
    [isOpen, onClose],
  )

  return (
    <div
      className={classnames(
        fontColor,
        fullscreen,
        zIndex('z-20'),
        display({ block: isOpen, hidden: !isOpen }),
        backgroundColor('bg-black'),
        backgroundOpacity('bg-opacity-30', 'dark:bg-opacity-60'),
        overflow('overflow-y-auto'),
      )}
      onKeyDown={handleKeyDown}
    >
      <div
        className={classnames(
          position('absolute'),
          inset('top-0', 'bottom-0', 'xs:top-8', 'xs:bottom-auto', 'xs:left-1/2'),
          padding('xs:pb-8'),
          width('w-full'),
          display('flex'),
          justifyContent('justify-center'),
          toClassname('xs:-translate-x-1/2'),
          toClassname('xs:w-[theme(screens.sm)]'),
          toClassname('xs:max-w-[calc(100vw-theme(space.16))]'),
        )}
      >
        {children}
      </div>
    </div>
  )
}

type DialogProps = React.PropsWithChildren<{
  id: string
  isOpen: boolean
}>

function Dialog({ id, isOpen, children }: DialogProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  useLockScroll({ ref, skip: !isOpen })
  useTrapFocus({ ref, skip: !isOpen })

  return (
    <div
      ref={ref}
      role="dialog"
      id={id}
      aria-labelledby={modalLabel(id)}
      aria-modal={true}
      className={classnames(
        backgroundWhite,
        position('absolute'),
        width('w-full'),
        maxWidth('max-w-full'),
        padding('p-2', 'sm:p-4'),
        borderWidth('border'),
        borderColor('xs:border-blue-600'),
        borderRadius('xs:rounded'),
        boxShadow('shadow-xl'),
      )}
      onClick={(evt) => evt.stopPropagation()}
    >
      {children}
    </div>
  )
}

type TitleProps = React.PropsWithChildren<{
  id: string
  isOpen: boolean
}>

function Title({ id, isOpen, children }: TitleProps): React.ReactElement {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const [focusable, setFocusable] = React.useState<boolean>(false)

  const setUnfocusable = React.useCallback(() => setFocusable(false), [])

  React.useEffect(() => {
    if (isOpen) setFocusable(true)
  }, [isOpen])

  React.useEffect(() => {
    if (focusable && ref.current) ref.current.focus()
  }, [focusable])

  return (
    <h2
      ref={ref}
      id={modalLabel(id)}
      tabIndex={focusable ? 0 : -1}
      className={classnames(
        subtitle,
        display('flex'),
        alignItems('items-center'),
        outlineStyle('outline-none'),
        breakWordsMinus8,
      )}
      onBlur={setUnfocusable}
    >
      {children}
    </h2>
  )
}

type ContentProps = {
  children: React.ReactNode
}

const modalButtonClass = classnames(
  minWidth('min-w-28'),
  width('w-full', 'xs:w-auto'),
  maxWidth('max-w-full'),
)

type ActionsProps = {
  confirmText: string
  confirmDestructive: boolean
  onConfirm?: () => void
  onClose: () => void
}

function Actions({
  confirmText,
  confirmDestructive,
  onConfirm,
  onClose,
}: ActionsProps): React.ReactElement {
  return (
    <div
      className={classnames(
        display('flex'),
        flexDirection('flex-col', 'xs:flex-row'),
        justifyContent('justify-end'),
        margin('mt-4'),
      )}
    >
      {onConfirm && confirmDestructive && (
        <Button
          color="red"
          className={classnames(modalButtonClass, margin('mr-0', 'mb-4', 'xs:mb-0', 'xs:mr-4'))}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      )}
      <Button className={classnames(modalButtonClass)} onClick={onClose}>
        Close
      </Button>
      {onConfirm && !confirmDestructive && (
        <Button
          color="blue"
          className={classnames(modalButtonClass, margin('ml-0', 'mt-4', 'xs:mt-0', 'xs:ml-4'))}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      )}
    </div>
  )
}

function Content({ children }: ContentProps): React.ReactElement {
  return <div className={classnames(margin('my-4'))}>{children}</div>
}

type CloseButtonProps = {
  onClose: () => void
}
function CloseButton({ onClose }: CloseButtonProps): React.ReactElement {
  return (
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
  )
}

function ErrorWrapper({ children }: { children?: React.ReactNode }): React.ReactElement {
  return <div className={classnames(padding('pt-8'))}>{children}</div>
}

export default React.memo(Modal)
