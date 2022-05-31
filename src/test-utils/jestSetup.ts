import { randomFillSync as getRandomValues, randomUUID } from 'crypto'

if (typeof window !== 'undefined') {
  // @ts-expect-error crypto.subtle not needed
  window.crypto = { getRandomValues, randomUUID }
}
