export default class Storage {
  constructor (key, initialData = {}) {
    this.key = key
    this.initialData = initialData
    initialize(key, initialData)
  }

  load () {
    return getItem(this.key)
  }

  save (data) {
    return setItem(this.key, data)
  }

  put (key, value) {
    return this.load().then(data => this.save({ ...data, [key]: value }))
  }

  get (key) {
    return this.load().then(data => data[key])
  }

  delete (key) {
    return this.load().then(({ [key]: _, ...data }) => this.save(data))
  }

  update (key, fn) {
    return this.load().then(data =>
      this.save({ ...data, [key]: fn(data[key]) })
    )
  }
  merge (object) {
    return this.load().then(data =>
      this.save({ ...data, ...validateObject(object) })
    )
  }

  reset () {
    return this.save(this.initialData)
  }

  remove () {
    return removeItem(this.key)
  }
}

const initialize = (key, initialData) => {
  const json = localStorage.getItem(key)

  if (json === null) {
    localStorage.setItem(key, JSON.stringify(validateObject(initialData)))
    return initialData
  } else {
    return validateObject(JSON.parse(json))
  }
}

const getItem = key => {
  return new Promise((resolve, reject) => {
    try {
      resolve(validateObject(JSON.parse(localStorage.getItem(key))))
    } catch (error) {
      reject(error)
    }
  })
}

const setItem = (key, data) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(validateObject(data)))
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

const removeItem = key => localStorage.removeItem(key)

const validateObject = object => {
  if (typeof object !== 'object' || object === null) {
    throw new Error('Storage item must be an object')
  }
  return object
}
