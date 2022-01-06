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
  overflow,
  padding,
  position,
  toClassname,
  translate,
  width,
} from '@src/ui/styles/classnames'
import { breakWordsMinus8, fullscreen, subtitle } from '@src/ui/styles/utils'
import { Key } from '@src/utils/dom'
import React from 'react'
import Portal from '../Portal'

const MODAL_LABEL = 'modal-label'

const modalButtonClass = classnames(
  minWidth('min-w-28'),
  width('w-full', 'sm:w-auto'),
  maxWidth('max-w-full'),
)

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
    <Portal>
      <ModalBackdrop isOpen={isOpen}>
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
          <Title>{title}</Title>

          <div className={classnames(margin('my-4'))}>{children}</div>
          <div
            className={classnames(
              display('flex'),
              flexDirection('flex-col', 'sm:flex-row'),
              justifyContent('justify-end'),
            )}
          >
            <Button className={classnames(modalButtonClass)} onClick={onClose}>
              Close
            </Button>
            {onConfirm && (
              <Button
                color="blue"
                className={classnames(
                  modalButtonClass,
                  margin('ml-0', 'mt-4', 'sm:mt-0', 'sm:ml-4'),
                )}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
          <CloseButton onClose={onClose} />
        </div>
      </ModalBackdrop>
    </Portal>
  )
}

type ModalBackdropProps = React.PropsWithChildren<{ isOpen: boolean }>
function ModalBackdrop({ isOpen, children }: ModalBackdropProps): React.ReactElement {
  return (
    <div
      className={classnames(
        fullscreen,
        display({ block: isOpen, hidden: !isOpen }),
        backgroundColor('bg-black'),
        backgroundOpacity('!bg-opacity-30'),
        overflow('overflow-y-auto'),
      )}
    >
      <div
        className={classnames(
          position('absolute'),
          inset('top-0', 'bottom-0', 'sm:top-8', 'sm:bottom-auto', 'sm:left-1/2'),
          padding('sm:pb-8'),
          translate('sm:-translate-x-1/2'),
          width('w-full'),
          toClassname('sm:w-[theme(screens.sm)]'),
          toClassname('sm:max-w-[calc(100vw-theme(space.16))]'),
        )}
      >
        {children}
      </div>
    </div>
  )
}

type TitleProps = {
  children: React.ReactNode
}

function Title({ children }: TitleProps): React.ReactElement {
  return (
    <h2
      id={MODAL_LABEL}
      className={classnames(
        subtitle,
        display('flex'),
        alignItems('items-center'),
        breakWordsMinus8,
      )}
    >
      {children}
    </h2>
  )
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

export default React.memo(Modal)
