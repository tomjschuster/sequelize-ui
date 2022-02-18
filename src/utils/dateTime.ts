export function now(): string {
  return fromDate(new Date(Date.now()))
}

export function fromParts(
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
): string {
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
  return fromDate(date)
}

export function toNumericTimestamp(dateTime: string): number {
  return parseInt(dateTime.replace(/\..*$/g, '').replace(/(\D)/g, ''))
}

export function addSeconds(dateTime: string, seconds: number): string {
  const date = toDate(dateTime)
  date.setSeconds(date.getSeconds() + seconds)
  return fromDate(date)
}

function fromDate(date: Date): string {
  return date.toISOString()
}

function toDate(dateTime: string): Date {
  return new Date(dateTime)
}

export enum TimeGranularity {
  YEARS = 'years',
  MONTHS = 'months',
  DAYS = 'days',
  HOURS = 'hours',
  MINUTES = 'minutes',
  SECONDS = 'seconds',
}

export function timeSince(
  current: string,
  date: string,
  granularity: TimeGranularity = TimeGranularity.SECONDS,
): string {
  const seconds = Math.floor((toDate(current).valueOf() - toDate(date).valueOf()) / 1000)
  let intervalType
  let lessThan = false

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1 || granularity === TimeGranularity.YEARS) {
    lessThan = interval < 1
    intervalType = 'year'
  } else {
    interval = Math.floor(seconds / 2629746)
    if (interval >= 1 || granularity === TimeGranularity.MONTHS) {
      lessThan = interval < 1
      intervalType = 'month'
    } else {
      interval = Math.floor(seconds / 86400)
      if (interval >= 1 || granularity === TimeGranularity.DAYS) {
        lessThan = interval < 1
        intervalType = 'day'
      } else {
        interval = Math.floor(seconds / 3600)
        if (interval >= 1 || granularity === TimeGranularity.HOURS) {
          lessThan = interval < 1
          intervalType = 'hour'
        } else {
          interval = Math.floor(seconds / 60)
          if (interval >= 1 || granularity === TimeGranularity.MINUTES) {
            lessThan = interval < 1
            intervalType = 'minute'
          } else {
            interval = seconds
            intervalType = 'second'
          }
        }
      }
    }
  }

  if (lessThan) {
    return `less than 1 ${intervalType}`
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's'
  }

  return interval + ' ' + intervalType
}
