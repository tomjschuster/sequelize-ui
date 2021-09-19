import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import React, { useRef } from 'react'
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
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  useLockScroll(ref)

  return (
    <div className={Styles.container} ref={ref}>
      <div className={Styles.title}>
        <div className={Styles.titleSiteName}>
          <img
            className={Styles.titleLogo}
            src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
          />
        </div>
        <h2>{title}</h2>
        <button className={Styles.close} onClick={onClickClose}>
          <CloseCircleIcon title="close" />
        </button>
      </div>
      {controls && <div className={Styles.controls}>{controls}</div>}
      <div className={Styles.content}>{children}</div>
    </div>
  )
}
