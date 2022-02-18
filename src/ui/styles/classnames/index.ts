export * from './__generated__/tailwindcss-classnames'
export type { Classname }
import { Override } from '@src/utils/types'
import classnamesLib from 'clsx'
import type { TArg as Classname } from './__generated__/tailwindcss-classnames'

export function toClassname(classname: string | undefined | { [key: string]: boolean }): Classname {
  return classnamesLib(classname) as Classname
}

export function darkModeClassname(darkMode: boolean): Classname {
  return darkMode ? ('dark' as Classname) : undefined
}

export type WithClassname<T> = Override<T, { className?: Classname }>
