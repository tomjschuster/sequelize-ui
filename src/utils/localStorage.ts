export function get<T>(key: string, toKey: (key: string) => string = lsKey): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    try {
      const item: string | null = localStorage.getItem(toKey(key))
      if (item === null) return resolve(item)
      const result: T = JSON.parse(item)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function set<T>(
  key: string,
  value: T,
  toKey: (key: string) => string = lsKey,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const payload = JSON.stringify(value)
      localStorage.setItem(toKey(key), payload)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function remove(key: string, toKey: (key: string) => string = lsKey): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      localStorage.removeItem(toKey(key))
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function clear(isKey: (key: string) => boolean = isLsKey): Promise<void> {
  const removePromises = Object.keys(localStorage)
    .filter(isKey)
    .map((key) => localStorage.removeItem(key))

  return Promise.all(removePromises).then()
}

const NAMESPACE = '__SEQUELIZEUI__'
function lsKey(key: string): string {
  return NAMESPACE + key
}
function isLsKey(key: string): boolean {
  return key.startsWith(NAMESPACE)
}
