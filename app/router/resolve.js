// Adapted from https://medium.freecodecamp.com/38673620f3d, @kriasoft
import toRegex from 'path-to-regexp'

// Returns object of url parameters if matched, null otherwise
const matchURI = (path, uri) => {
  const keys = []
  const pattern = toRegex(path, keys)
  const match = pattern.exec(uri)
  return match === null ? null :
    match.slice(1).reduce((params, param, idx) => ({
      ...params, [keys[idx].name]: param
    }), {})
}

// Checks current browsing context agains all routes, resolving with result
// of action of first matched route, or rejecting with 404 error if not found
const resolve = (routes, context) => {
  const route = routes.reduce((match, route) => {
    const uri = context.error ? '/error' : context.pathname
    const params = matchURI(route.path, uri)
    return !match && params ?
      new Promise((resolve, reject) => {
          try {
            resolve(route.action({ ...context, params }))
          } catch (e) {
            reject(e)
          }
      }) :
      match
  }, null)
  if (route) {
    return route
  }
  const error = Object.assign(new Error('Not found'), { status: 404 })
  return Promise.reject(error)
}

export default resolve
