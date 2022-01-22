import { isBrowser } from '@src/utils/dom'
import React from 'react'

// export default function useDarkMode() {
//   // Use our useLocalStorage hook to persist state through a page refresh.
//   // Read the recipe for this hook to learn more: usehooks.com/useLocalStorage
//   const [enabledState, setEnabledState] = useLocalStorage('dark-mode-enabled')
//   // See if user has set a browser or OS preference for dark mode.
//   // The usePrefersDarkMode hook composes a useMedia hook (see code below).
//   const prefersDarkMode = usePrefersDarkMode()
//   // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
//   // This allows user to override OS level setting on our website.
//   const enabled = typeof enabledState !== 'undefined' ? enabledState : prefersDarkMode
//   // Fire off effect that add/removes dark mode class
//   React.useEffect(
//     () => {
//       const className = 'dark-mode'
//       const element = window.document.body
//       if (enabled) {
//         element.classList.add(className)
//       } else {
//         element.classList.remove(className)
//       }
//     },
//     [enabled], // Only re-call effect when value changes
//   )
//   // Return enabled state and setter
//   return [enabled, setEnabledState]
// }

export function usePrefersDarkMode(): boolean {
  const mediaQueryList = React.useMemo(getPrefersDarkModeMql, [])
  const [prefersDarkMode, setPrefersDarkMode] = React.useState<boolean>(false)

  React.useEffect(() => {
    setPrefersDarkMode(mediaQueryList?.matches || false)
    const handler = () => setPrefersDarkMode(mediaQueryList?.matches || false)
    mediaQueryList?.addEventListener('change', handler)
    return () => mediaQueryList?.removeEventListener('change', handler)
  }, [])

  return prefersDarkMode
}

function getPrefersDarkModeMql(): MediaQueryList | undefined {
  return isBrowser() ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
}

// // Hook
// function useLocalStorage<T>(key: string, initialValue?: T): [T, (value: T) => void] {
//   // State to store our value
//   // Pass initial state function to useState so logic is only executed once
//   const [storedValue, setStoredValue] = React.useState(() => {
//     try {
//       // Get from local storage by key
//       const item = window.localStorage.getItem(key)
//       // Parse stored json or if none return initialValue
//       return item ? JSON.parse(item) : initialValue
//     } catch (error) {
//       // If error also return initialValue
//       console.log(error)
//       return initialValue
//     }
//   })
//   // Return a wrapped version of useState's setter function that ...
//   // ... persists the new value to localStorage.
//   const setValue = React.useCallback(
//     (value: T) => {
//       try {
//         // Allow value to be a function so we have same API as useState
//         const valueToStore = value instanceof Function ? value(storedValue) : value
//         // Save state
//         setStoredValue(valueToStore)
//         // Save to local storage
//         window.localStorage.setItem(key, JSON.stringify(valueToStore))
//       } catch (error) {
//         // A more advanced implementation would handle the error case
//         console.log(error)
//       }
//     },
//     [key, storedValue],
//   )

//   return [storedValue, setValue]
// }
