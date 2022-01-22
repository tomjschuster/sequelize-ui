export function get<T>(key: string): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    try {
      const item: string | null = localStorage.getItem(key)
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
      localStorage.setItem(key, payload)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function remove(key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      localStorage.removeItem(key)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export function clear(prefix: string = '__SEQUELIZEUI__'): Promise<void> {
  const removePromises = Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => localStorage.removeItem(key))

  return Promise.all(removePromises).then()
}

const NAMESPACE = '__SEQUELIZEUI__'
export function lsKey(key: string): string {
  return NAMESPACE + key
}
