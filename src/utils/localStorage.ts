export function get<T>(key: string): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    try {
      const item: string | null = localStorage.getItem(lsKey(key))
      if (item === null) return resolve(item)
      const result: T = JSON.parse(item)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function set<T>(key: string, value: T): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const payload = JSON.stringify(value)
      localStorage.setItem(lsKey(key), payload)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function remove(key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      localStorage.removeItem(lsKey(key))
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function clear(): Promise<void> {
  const removePromises = Object.keys(localStorage).filter(isLsKey).map(remove)

  return Promise.all(removePromises).then()
}

const NAMESPACE = `__SEQUELIZEUI__`
function lsKey(key: string): string {
  return NAMESPACE + key
}
function isLsKey(key: string): boolean {
  return key.startsWith(NAMESPACE)
}
