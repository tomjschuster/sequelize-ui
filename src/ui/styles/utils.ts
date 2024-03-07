import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  boxShadowColor,
  Classname,
  classnames,
  display,
  flexDirection,
  fontSize,
  fontWeight,
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
  textColor,
  textDecoration,
  toClassname,
  width,
  wordBreak,
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

export const flexCenterVertical = classnames(display('flex'), alignItems('items-center'))

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
  maxWidth('max-w-screen-md'),
  margin('mx-auto'),
)

export const sectionWide = classnames(section, maxWidth('lg:max-w-screen-lg'))

export const fontColor = textColor('text-black', 'dark:text-gray-300')
export const backgroundWhite = backgroundColor('bg-white', 'dark:bg-gray-900')

export const title = classnames(fontColor, fontSize('text-2xl'), margin('mb-4'))
export const subtitle = classnames(fontColor, fontSize('text-lg'), margin('mb-2'))

export const text = classnames(fontColor, fontSize('text-sm'), margin('mb-2'))

export const link = classnames(fontColor, fontWeight('font-semibold'), textDecoration('underline'))
export const linkBlue = classnames(
  fontWeight('font-semibold'),
  textColor('text-blue-700', 'dark:text-blue-300'),
  textDecoration('hover:underline'),
)

export const breakWords = classnames(wordBreak('break-words'), width('w-full'))

export const breakWordsMinus8 = classnames(
  wordBreak('break-words'),
  toClassname('w-[calc(100%-theme(space.8))]'),
)

export const breakWordsMinus16 = classnames(
  wordBreak('break-words'),
  toClassname('w-[calc(100%-theme(space.16))]'),
)

export const list = classnames(
  fontSize('text-sm'),
  listStyleType('list-disc'),
  listStylePosition('list-outside'),
  lineHeight('leading-loose'),
  margin('ml-8'),
)

const panelBase = classnames(
  borderWidth('border'),
  borderColor('border-gray-400', 'dark:border-gray-600'),
  borderRadius('rounded'),
)

export const panel = classnames(
  panelBase,
  backgroundColor('bg-white', 'dark:bg-gray-800'),
  width('w-full'),
  height('h-full'),
)

export const panelHeader = classnames(
  padding('p-2'),
  borderWidth('border-b'),
  borderColor('border-gray-400', 'dark:border-gray-600'),
)

export const panelAction = classnames(
  panel,
  padding('p-2'),
  borderColor('hover:border-gray-800', toClassname('dark:hover:border-gray-400')),
)

export const inlineButton = (bgColor: Classname = backgroundColor('bg-gray-100')) =>
  classnames(
    panelBase,
    padding('p-2'),
    padding('py-0.5'),
    padding('px-1.5'),
    padding('p-0.5'),
    toClassname(`hover:${bgColor}`),
  )

export const panelGrid = classnames(
  display('grid'),
  gridTemplateColumns('lg:grid-cols-3', 'md:grid-cols-2', 'sm:grid-cols-2', 'grid-cols-1'),
  gap('gap-6'),
  gridAutoRows('sm:auto-rows-fr'),
  width('w-full'),
)

export const fieldsetGrid = classnames(
  padding('p-2', 'xs:p-4'),
  padding('pt-8'),
  display('grid'),
  gridTemplateColumns('grid-cols-12'),
  gap('gap-y-0', 'gap-x-4'),
  position('relative'),
)

export const overlayContainer = classnames(
  width('w-32'),
  backgroundColor('bg-white', 'dark:bg-gray-800'),
  borderWidth('border'),
  borderColor('border-gray-300', 'dark:border-gray-600'),
  borderRadius('rounded'),
  boxShadow('shadow-lg', 'dark:shadow-sm'),
  boxShadowColor('shadow-black', 'dark:shadow-gray-800'),
  padding('py-1'),
)

export type MediaQuery = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const HIDDEN_MEDIA_QUERIES = [
  '2xs:hidden',
  'xs:hidden',
  'sm:hidden',
  'md:hidden',
  'lg:hidden',
  'xl:hidden',
  '2xl:hidden',
]

export const FLEX_MEDIA_QUERIES = [
  '2xs:flex',
  'xs:flex',
  'sm:flex',
  'md:flex',
  'lg:flex',
  'xl:flex',
  '2xl:flex',
]
