import styled from '@src/ui/styles/tailwind-components'
import { fullscreen } from '@src/ui/styles/utils'

export const Container = styled.div(
  fullscreen,
  'bg-gray-50',
  'overflow-y-scroll',
  'z-10',
  'border-gray-500',
  'border-2',
  'flex',
  'flex-col',
)

export const TitleContainer = styled.div(
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
)

export const LogoContainer = styled.div('p-1', 'flex', 'items-center')

export const Logo = styled.img('h-6')

export const CloseButton = styled.button('p-0.5', 'hover:bg-gray-200')

export const ControlsContainer = styled.div(
  'relative',
  'overflow-visible',
  'h-9',
  'flex',
  'items-center',
  'border-b',
  'border-gray-900',
)

export const ContentContainer = styled.div('flex-auto', 'overflow-y-scroll')

export const ActionsContainer = styled.div('text-sm', 'flex', 'w-full')

export const ActionButton = styled.button('py-1', 'px-2', 'hover:bg-gray-200')
