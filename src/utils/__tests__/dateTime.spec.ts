import { addSeconds, fromParts, now, toNumericTimestamp } from '../dateTime'

describe('dateTime utils', () => {
  describe('now', () => {
    const cases = [
      [0, '1970-01-01T00:00:00.000Z'],
      [946684800000, '2000-01-01T00:00:00.000Z'],
      [1274604175000, '2010-05-23T08:42:55.000Z'],
      [32503679999000, '2999-12-31T23:59:59.000Z'],
    ] as [number, string][]

    it.each(cases)('now(%s) === %s', (unixMs, expected) => {
      jest.spyOn(Date, 'now').mockReturnValueOnce(unixMs)
      expect(now()).toEqual(expected)
    })
  })

  describe('fromParts', () => {
    const cases = [
      [[1970, 1, 1, 0, 0, 0], '1970-01-01T00:00:00.000Z'],
      [[2000, 1, 1, 0, 0, 0], '2000-01-01T00:00:00.000Z'],
      [[2010, 5, 23, 8, 42, 55], '2010-05-23T08:42:55.000Z'],
      [[2999, 12, 31, 23, 59, 59], '2999-12-31T23:59:59.000Z'],
    ] as [[number, number, number, number, number, number], string][]

    it.each(cases)('fromParts(%s) === %s', (parts, expected) => {
      expect(fromParts(...parts)).toEqual(expected)
    })
  })

  describe('toNumericTimestamp', () => {
    const cases = [
      ['1970-01-01T00:00:00.000Z', 19700101000000],
      ['2000-01-01T00:00:00.000Z', 20000101000000],
      ['2010-05-23T08:42:55.000Z', 20100523084255],
      ['2999-12-31T23:59:59.000Z', 29991231235959],
    ] as [string, number][]

    it.each(cases)('toNumericTimestamp(%s) === %s', (dateTime, expected) => {
      expect(toNumericTimestamp(dateTime)).toEqual(expected)
    })

    describe('addSeconds', () => {
      const cases = [
        ['1970-01-01T00:00:00.000Z', 10, '1970-01-01T00:00:10.000Z'],
        ['2000-01-01T00:00:00.000Z', 61, '2000-01-01T00:01:01.000Z'],
        ['2010-05-23T08:42:55.000Z', 15, '2010-05-23T08:43:10.000Z'],
        ['2999-12-31T23:59:59.000Z', 2, '3000-01-01T00:00:01.000Z'],
      ] as [string, number, string][]

      it.each(cases)('addSeconds(%s) === %s', (dateTime, seconds, expected) => {
        expect(addSeconds(dateTime, seconds)).toEqual(expected)
      })
    })
  })
})
