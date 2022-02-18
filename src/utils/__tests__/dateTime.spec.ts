import {
  addSeconds,
  fromParts,
  now,
  TimeGranularity,
  timeSince,
  toNumericTimestamp,
} from '../dateTime'

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

  describe('timeSince utils', () => {
    describe('now', () => {
      const POSIX_START = '1970-01-01T00:00:00.000Z'

      const SAMPLE_DATE = '2021-09-19T13:19:24.000Z'
      const SAMPLE_DATE_PLUS_59_SECS = '2021-09-19T13:20:23.000Z'
      const SAMPLE_DATE_PLUS_60_SECS = '2021-09-19T13:20:24.000Z'
      const SAMPLE_DATE_PLUS_61_SECS = '2021-09-19T13:20:25.000Z'
      const SAMPLE_DATE_PLUS_59_MINS = '2021-09-19T14:18:24.000Z'
      const SAMPLE_DATE_PLUS_60_MINS = '2021-09-19T14:19:24.000Z'
      const SAMPLE_DATE_PLUS_61_MINS = '2021-09-19T14:20:24.000Z'
      const SAMPLE_DATE_PLUS_23_HRS = '2021-09-20T12:19:24.000Z'
      const SAMPLE_DATE_PLUS_24_HRS = '2021-09-20T13:19:24.000Z'
      const SAMPLE_DATE_PLUS_25_HRS = '2021-09-20T14:19:24.000Z'
      const SAMPLE_DATE_PLUS_364_DAYS = '2022-09-18T13:19:24.000Z'
      const SAMPLE_DATE_PLUS_365_DAYS = '2022-09-19T13:19:24.000Z'
      const SAMPLE_DATE_PLUS_366_DAYS = '2022-09-20T13:19:24.000Z'
      const SAMPLE_DATE_PLUS_3_YEARS = '2024-09-19T13:19:24.000Z'

      const cases = [
        [POSIX_START, POSIX_START, TimeGranularity.MINUTES, 'less than 1 minute'],
        [POSIX_START, POSIX_START, TimeGranularity.HOURS, 'less than 1 hour'],
        [POSIX_START, POSIX_START, TimeGranularity.DAYS, 'less than 1 day'],
        [POSIX_START, POSIX_START, TimeGranularity.MONTHS, 'less than 1 month'],
        [POSIX_START, POSIX_START, TimeGranularity.YEARS, 'less than 1 year'],
        [SAMPLE_DATE_PLUS_59_SECS, SAMPLE_DATE, TimeGranularity.SECONDS, '59 seconds'],
        [SAMPLE_DATE_PLUS_60_SECS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 minute'],
        [SAMPLE_DATE_PLUS_61_SECS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 minute'],
        [SAMPLE_DATE_PLUS_59_MINS, SAMPLE_DATE, TimeGranularity.SECONDS, '59 minutes'],
        [SAMPLE_DATE_PLUS_60_MINS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 hour'],
        [SAMPLE_DATE_PLUS_61_MINS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 hour'],
        [SAMPLE_DATE_PLUS_23_HRS, SAMPLE_DATE, TimeGranularity.SECONDS, '23 hours'],
        [SAMPLE_DATE_PLUS_24_HRS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 day'],
        [SAMPLE_DATE_PLUS_25_HRS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 day'],
        [SAMPLE_DATE_PLUS_364_DAYS, SAMPLE_DATE, TimeGranularity.SECONDS, '11 months'],
        [SAMPLE_DATE_PLUS_365_DAYS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 year'],
        [SAMPLE_DATE_PLUS_366_DAYS, SAMPLE_DATE, TimeGranularity.SECONDS, '1 year'],
        [SAMPLE_DATE_PLUS_3_YEARS, SAMPLE_DATE, TimeGranularity.SECONDS, '3 years'],
      ] as [string, string, TimeGranularity | undefined, string][]
      it.each(cases)('now(%s) === %s', (current, target, granularity, expected) => {
        expect(timeSince(current, target, granularity)).toEqual(expected)
      })
    })
  })
})
