import CloseCircleIcon from '@src/ui/components/icons/CloseCircle'
import useLockScroll from '@src/ui/hooks/useLockScroll'
import useTrapFocus from '@src/ui/hooks/useTrapFocus'
import React, { useRef } from 'react'
import {
  CloseButton,
  Container,
  ContentContainer,
  ControlsContainer,
  Logo,
  LogoContainer,
  TitleContainer,
} from './styles'

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
  useTrapFocus({ ref, shouldTrap: true })

  return (
    <Container ref={ref}>
      <TitleContainer>
        <LogoContainer>
          <Logo src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg" />
        </LogoContainer>
        <h2>{title}</h2>
        <CloseButton onClick={onClickClose}>
          <CloseCircleIcon title="close" />
        </CloseButton>
      </TitleContainer>
      {controls && <ControlsContainer>{controls}</ControlsContainer>}
      <ContentContainer>{children}</ContentContainer>
    </Container>
  )
}
