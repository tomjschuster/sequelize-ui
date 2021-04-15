import { noCase, sentenceCase, snakeCase } from 'change-case'
import { plural, singular } from 'pluralize'

export {
  camelCase,
  noCase,
  paramCase as kebabCase,
  pascalCase,
  sentenceCase,
  snakeCase,
} from 'change-case'
export { plural, singular } from 'pluralize'

export function titleCase(value: string): string {
  return noCase(value)
    .split(' ')
    .map((input) => sentenceCase(input))
    .join(' ')
}

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

/** Check if normalized names are equal */
export function namesEq(a?: string, b?: string): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  return snakeCase(a) === snakeCase(b)
}

/** Check if normalized names are equal */
export function namesEqSingular(a?: string, b?: string): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  return singular(snakeCase(a)) === singular(snakeCase(b))
}

/** Check if normalized name is empty */
export function nameEmpty(a?: string): boolean {
  if (!a) return true
  return !snakeCase(a)
}

export function nameLongerThan(a: string | undefined, length: number): boolean {
  if (!a) return false
  return singular(snakeCase(a)).length > length && plural(snakeCase(a)).length > length
}

/** Check if normalized name starts with a number */
export function nameStartsWithNumber(x?: string): boolean {
  if (!x) return false
  return /^\d/.test(snakeCase(x))
}
