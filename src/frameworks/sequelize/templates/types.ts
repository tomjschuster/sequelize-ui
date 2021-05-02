import { blank, lines } from '@src/core/codegen'

export function typesTemplate(): string {
  return lines([jsonType()])
}

function jsonType(): string {
  return lines([
    `export interface JsonMap {[member: string]: string | number | boolean | null | JsonArray | JsonMap }`,
    blank(),
    `export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {}`,
    blank(),
    `export type Json = JsonMap | JsonArray | string | number | boolean | null`,
    blank(),
  ])
}
