export const extract = (state, keys) => {
  if (keys === true) {
    return state
  }

  if (!isObject(state)) {
    return state
  }

  if (Array.isArray(keys)) {
    return extract(state, arrayToTrueObject(keys))
  }

  if (isString(keys)) {
    return extract(state, { [keys]: true })
  }

  if (isObject(keys)) {
    return extractExistingKeys(state, keys)
  }

  throw new Error('Keys must be an array or an object')
}

const isString = value => typeof value === 'string'
const isObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const extractExistingKeys = (state, keys) => {
  const acc = {}
  const entries = Object.entries(keys)

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]
    if (state.hasOwnProperty(key)) {
      acc[key] = extract(state[key], value)
    }
  }

  return acc
}

const arrayToTrueObject = array => {
  const trueObject = {}

  for (let i = 0; i < array.length; i++) {
    trueObject[array[i]] = true
  }

  return trueObject
}

export const merge = (value1, value2) => {
  if (isObject(value1) && isObject(value2)) {
    return mergeObjects(value1, value2)
  } else {
    return value2
  }
}

const mergeObjects = (obj1, obj2) => {
  const obj1Copy = { ...obj1 }
  const entries = Object.entries(obj2)

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]
    if (obj1Copy.hasOwnProperty(key)) {
      obj1Copy[key] = merge(obj1Copy[key], value)
    } else {
      obj1Copy[key] = value
    }
  }

  return obj1Copy
}
