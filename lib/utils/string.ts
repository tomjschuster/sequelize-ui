export { camelCase, paramCase as kebabCase, pascalCase, snakeCase } from 'change-case'
export { plural, singular } from 'pluralize'

/**
 * Given a name and a list of existing names, find the lowest "version" name available
 *
 * @example
 * // returns 'foo'
 * versionedName('foo', ['bar'])
 * @example
 * // returns 'foo (1);
 * versionedName('foo', ['foo', 'bar'])
 * @example
 * // returns 'foo'
 * versionedName('foo', ['bar', 'foo (2)'])
 */
export function versionedName(name: string, currNames: string[]): string {
  const lowestAvailableVersion = getLowestAvailableVersion(name, currNames)
  return lowestAvailableVersion === 0 ? name : `${name} (${lowestAvailableVersion})`
}

function getLowestAvailableVersion(name: string, currNames: string[]): number {
  return currNames
    .map((currName) => getNameVersion(currName, name))
    .filter((x): x is number => x !== undefined)
    .sort()
    .reduce<number>((version, currVersion) => (version === currVersion ? version + 1 : version), 0)
}

function getNameVersion(name: string, matchName: string): number | undefined {
  if (name === matchName) return 0
  // 'foo (1)' matches '1'
  const match = name.match(new RegExp(`${matchName}\\s\\((\\d+)\\)`))
  if (!match) return undefined
  const [, versionString] = match
  const version = parseInt(versionString)

  // Only names with postive versions are created, so ignore any other numbers
  return version > 0 ? version : undefined
}
