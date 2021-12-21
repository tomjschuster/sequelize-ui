export * from './__generated__/tailwindcss-classnames'
export type { Classname }
import type { TArg as Classname } from './__generated__/tailwindcss-classnames'

export function toClassname(classname: string | undefined): Classname {
  return classname as Classname
}
