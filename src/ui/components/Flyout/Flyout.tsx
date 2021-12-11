import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import { useTrapFocus } from '@src/ui/lib/focus'
import { classnames } from '@src/ui/styles/classnames'
import { fullscreen } from '@src/ui/styles/utils'
import React from 'react'
import IconButton from '../form/IconButton'

type FlyoutProps = React.PropsWithChildren<{
  title: string
  controls?: React.ReactNode
  onClickClose: () => void
}>

export default function Flyout({
  title,
  controls,
  onClickClose,
  children,
}: FlyoutProps): React.ReactElement | null {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  useLockScroll(ref)
  useTrapFocus({ ref })

  return (
    <div
      className={classnames(
        fullscreen,
        'bg-gray-50',
        'overflow-y-scroll',
        'z-10',
        'border-gray-500',
        'border-2',
        'flex',
        'flex-col',
      )}
      ref={ref}
    >
      <div
        className={classnames(
          'relative',
          'h-8',
          'flex',
          'items-center',
          'justify-between',
          'border-b',
          'bg-gradient-to-r',
          'from-blue-100',
          'to-blue-50',
          'border-gray-900',
          'shadow-inner',
        )}
      >
        <div className={classnames('p-1', 'flex', 'items-center')}>
          <img
            className={classnames('h-6')}
            src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
          />
        </div>
        <h2>{title}</h2>
        <IconButton
          label="close"
          icon={CloseCircleIcon}
          iconProps={{ size: 6 }}
          onClick={onClickClose}
        />
      </div>
      {controls && (
        <div
          className={classnames(
            'relative',
            'bg-white',
            'overflow-visible',
            'h-10',
            'flex',
            'items-center',
            'border-b',
            'border-gray-900',
          )}
        >
          {controls}
        </div>
      )}
      <div className={classnames('flex-auto', 'overflow-y-scroll')}>{children}</div>
    </div>
  )
}
