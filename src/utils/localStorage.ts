import { isBrowser } from './dom'

export function get<T>(key: string): T | null {
  if (!isBrowser()) return null

  const item: string | null = localStorage.getItem(key)
  if (item === null) return null
  const result: T = JSON.parse(item)
  return result
}

export function set<T>(key: string, value: T): void {
  if (!isBrowser()) return

  const payload = JSON.stringify(value)
  localStorage.setItem(key, payload)
}

export function remove(key: string): void {
  if (!isBrowser()) return

  localStorage.removeItem(key)
}

export function clear(prefix: string = '__SEQUELIZEUI__'): void {
  if (!isBrowser()) return

  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => localStorage.removeItem(key))
}

const NAMESPACE = '__SEQUELIZEUI__'
export function lsKey(key: string): string {
  return NAMESPACE + key
}
