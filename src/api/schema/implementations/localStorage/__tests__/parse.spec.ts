import { deepDropKeys } from '@src/utils/object'
import { blogLegacy } from '../__fixtures__/blogLegacy'
import { blogTranslatedFromLegacy } from '../__fixtures__/blogTranslatedFromLegacy'
import { blogTranslatedFromV1 } from '../__fixtures__/blogTranslatedFromV1'
import { blogV1 } from '../__fixtures__/blogV1'
import { blogV1_0_1 } from '../__fixtures__/blogV1-0-1'
import { fromV0 } from '../v0/translate'
import { fromV1, toV1 } from '../v1/translate'

describe('translate (legacy)', () => {
  // time stamps are added when migrating from legacy
  const dropKeys = ['createdAt', 'updatedAt']

  it('migrates the blog schema', () => {
    const { id: _id1, ...result } = deepDropKeys(fromV0(blogLegacy), dropKeys)
    const { id: _id2, ...expected } = deepDropKeys(blogTranslatedFromLegacy, dropKeys)

    expect(result).toEqual(expected)
  })
})

describe('translate (v1)', () => {
  it('translates to', () => {
    expect(fromV1(blogV1)).toEqual(blogTranslatedFromV1)
  })

  it('translates from (1.0)', () => {
    const result = deepDropKeys(toV1(blogTranslatedFromV1), ['softDelete'])
    expect(result).toEqual(blogV1)
  })

  it('translates from (1.0.1)', () => {
    expect(toV1(blogTranslatedFromV1)).toEqual(blogV1_0_1)
  })
})
