import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  flexDirection,
  fontSize,
  gap,
  gridAutoRows,
  gridTemplateColumns,
  height,
  inset,
  justifyContent,
  lineHeight,
  listStylePosition,
  listStyleType,
  margin,
  maxWidth,
  padding,
  position,
  width,
} from './classnames'

export const fullscreen = classnames(
  height('h-screen'),
  width('w-screen'),
  position('fixed'),
  inset('top-0', 'left-0'),
)

export const flexCenter = classnames(
  display('flex'),
  alignItems('items-center'),
  justifyContent('justify-center'),
)

export const flexCenterColumn = classnames(
  display('flex'),
  alignItems('items-center'),
  justifyContent('justify-center'),
  flexDirection('flex-col'),
)

export const flexCenterBetween = classnames(
  display('flex'),
  alignItems('items-center'),
  justifyContent('justify-between'),
)

export const section = classnames(
  width('w-full'),
  display('flex'),
  flexDirection('flex-col'),
  maxWidth('max-w-screen-lg'),
  margin('mx-auto'),
)

export const title = classnames(fontSize('text-2xl'), margin('mb-4'))
export const subtitle = classnames(fontSize('text-xl'), margin('mb-2'))

export const text = classnames(fontSize('text-sm'), margin('mb-2'))

export const list = classnames(
  fontSize('text-sm'),
  listStyleType('list-disc'),
  listStylePosition('list-inside'),
  lineHeight('leading-loose'),
)

const panelBase = classnames(
  borderWidth('border'),
  borderColor('border-gray-400'),
  borderRadius('rounded'),
  backgroundColor('bg-white'),
)

export const panel = classnames(panelBase, width('w-full'), height('h-full'))

export const panelHeader = classnames(
  padding('p-2'),
  borderWidth('border-b'),
  borderColor('border-gray-400'),
)

export const panelAction = classnames(
  panel,
  flexCenter,
  padding('p-2'),
  borderColor('hover:border-gray-800'),
)

export const inlineButton = classnames(
  panelBase,
  padding('p-2'),
  padding('py-0.5'),
  padding('px-1.5'),
  padding('p-0.5'),
  backgroundColor('hover:bg-gray-100'),
)

export const panelGrid = classnames(
  display('grid'),
  gridTemplateColumns('lg:grid-cols-3', 'md:grid-cols-2', 'sm:grid-cols-2', 'grid-cols-1'),
  gap('gap-6'),
  gridAutoRows('auto-rows-fr'),
  width('w-full'),
)

export const fieldsetGrid = classnames(
  padding('p-4'),
  padding('pt-8'),
  display('grid'),
  gridTemplateColumns('grid-cols-12'),
  gap('gap-y-0', 'gap-x-4'),
  position('relative'),
)
