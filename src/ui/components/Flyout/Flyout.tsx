import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import { useTrapFocus } from '@src/ui/lib/focus'
import {
  alignItems,
  backgroundColor,
  backgroundImage,
  borderColor,
  borderWidth,
  boxShadow,
  classnames,
  display,
  flex,
  flexDirection,
  gradientColorStops,
  height,
  overflow,
  padding,
  position,
  width,
  zIndex,
} from '@src/ui/styles/classnames'
import { backgroundWhite, flexCenterBetween, fullscreen } from '@src/ui/styles/utils'
import React from 'react'
import IconButton from '../form/IconButton'
import SequelizeUiLogo from '../SequelizeUiLogo'

type FlyoutProps = React.PropsWithChildren<{
  title: string
  controls?: React.ReactNode
  contentRef?: React.Ref<HTMLDivElement>
  onClickClose: () => void
}>

export default function Flyout({
  title,
  controls,
  contentRef,
  children,
  onClickClose,
}: FlyoutProps): React.ReactElement | null {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  useLockScroll({ ref })
  useTrapFocus({ ref })

  return (
    <div
      className={classnames(
        fullscreen,
        backgroundColor('bg-gray-50'),
        overflow('overflow-y-scroll'),
        zIndex('z-10'),
        borderColor('border-gray-500'),
        borderWidth('border-2'),
        display('flex'),
        flexDirection('flex-col'),
      )}
      ref={ref}
    >
      <div
        className={classnames(
          flexCenterBetween,
          position('relative'),
          height('h-8'),
          borderWidth('border-b'),
          backgroundImage('bg-gradient-to-r'),
          gradientColorStops('from-blue-100', 'to-blue-50'),
          borderColor('border-gray-900'),
          boxShadow('shadow-inner'),
        )}
      >
        <div className={classnames(padding('p-1'), display('flex'), alignItems('items-center'))}>
          <SequelizeUiLogo className={classnames(display('inline'), height('h-6'), width('w-6'))} />
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
            position('relative'),
            backgroundWhite,
            overflow('overflow-visible'),
            height('h-10'),
            display('flex'),
            alignItems('items-center'),
            borderWidth('border-b'),
            borderColor('border-gray-900'),
          )}
        >
          {controls}
        </div>
      )}
      <div
        ref={contentRef}
        className={classnames(flex('flex-auto'), overflow('overflow-y-scroll'))}
      >
        {children}
      </div>
    </div>
  )
}
