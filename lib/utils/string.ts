export { camelCase, paramCase as kebabCase, pascalCase, snakeCase } from 'change-case'
export { plural, singular } from 'pluralize'

export function versionedName(name: string, names: string[]): string {
  const latestVersion = getLatestNameVersion(name, names)
  if (latestVersion === undefined) return name
  return `${name} (${latestVersion + 1})`
}

function getLatestNameVersion(name: string, names: string[]): number | undefined {
  return names.reduce<number | undefined>((acc, currName) => {
    if (name === currName && acc === undefined) return 0
    const match = currName.match(new RegExp(`${name}\\s\\((\\d+)\\)`))
    if (!match) return acc
    const [, versionString] = match
    const version = versionString === undefined ? 0 : parseInt(versionString)
    if (isNaN(version) || version <= 0) return acc
    if (acc === undefined) return version
    if (version === 0) return
    return Math.max(acc, version)
  }, undefined)
}
