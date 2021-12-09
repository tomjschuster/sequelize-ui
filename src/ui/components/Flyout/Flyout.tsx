import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import { useTrapFocus } from '@src/ui/lib/focus'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import IconButton from '../form/IconButton'
import * as Styles from './styles'

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
    <div className={Styles.container} ref={ref}>
      <div className={Styles.titleContainer}>
        <div className={Styles.logoContainer}>
          <img
            className={Styles.logo}
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
      {controls && <div className={Styles.controlsContainer}>{controls}</div>}
      <div className={classnames('flex-auto', 'overflow-y-scroll')}>{children}</div>
    </div>
  )
}
