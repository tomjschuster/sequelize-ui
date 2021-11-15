import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import useTrapFocus from '@src/ui/hooks/useTrapFocus'
import React from 'react'
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
  useTrapFocus({ ref, shouldTrap: true })

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
        <button className={Styles.closeButton} type="button" onClick={onClickClose}>
          <CloseCircleIcon title="close" />
        </button>
      </div>
      {controls && <div className={Styles.controlsContainer}>{controls}</div>}
      <div className={Styles.contentContainer}>{children}</div>
    </div>
  )
}
