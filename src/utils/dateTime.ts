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
