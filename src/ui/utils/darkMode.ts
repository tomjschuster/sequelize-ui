import { isBrowser } from '@src/utils/dom'
import { get, remove, set } from '@src/utils/localStorage'

const LOCAL_STORAGE_KEY = 'dark-mode-enabled'
const CLASS_NAME = 'dark'

export function prefersDarkMode(): boolean {
  return prefersDarkModeExplicit() ?? prefersDarkModeSystem()
}

export function prefersDarkModeExplicit(): boolean | null {
  return get(LOCAL_STORAGE_KEY)
}

export function setPrefersDarkModeExplicit(darkMode: boolean | null): void {
  if (darkMode === null) {
    remove(LOCAL_STORAGE_KEY)
  } else {
    set(LOCAL_STORAGE_KEY, darkMode)
  }
}

export function prefersDarkModeSystem(): boolean {
  return !!getPrefersDarkModeMql()?.matches
}

export function getPrefersDarkModeMql(): MediaQueryList | undefined {
  return isBrowser() ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
}

export function syncDomDarkMode(darkMode: boolean): void {
  const element = window.document.documentElement
  if (darkMode) {
    element.classList.add(CLASS_NAME)
  } else {
    element.classList.remove(CLASS_NAME)
  }
}

export function syncDomDarkModeScriptSource(): string {
  return `
      const explicitDarkModeLs = localStorage.getItem('${LOCAL_STORAGE_KEY}')
      const darkModeMql =  window.matchMedia('(prefers-color-scheme: dark)')
      const darkMode = explicitDarkModeLs ? explicitDarkModeLs === 'true' : darkModeMql.matches
      const element = window.document.documentElement

      if (darkMode) {
        element.classList.add('${CLASS_NAME}')
      } else {
          element.classList.remove('${CLASS_NAME}')
      }
    `
}
