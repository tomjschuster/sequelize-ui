import { fromV1, toV1 } from '../v1/translate'
import { userPreferencesTranslatedFromV1 } from '../__fixtures__/userPreferencesTranslatedFromV1'
import { userPreferencesV1 } from '../__fixtures__/userPreferencesV1'

describe('translate (v1)', () => {
  it('translates to', () => {
    expect(fromV1(userPreferencesV1)).toEqual(userPreferencesTranslatedFromV1)
  })

  it('translates from', () => {
    const result = toV1(userPreferencesTranslatedFromV1)
    expect(result).toEqual(userPreferencesV1)
  })
})
