import scrollIntoView from 'scroll-into-view-if-needed'

export function focusById(id: string): void {
  document.getElementById(id)?.focus()
}

export function scrollIntoViewIfNeeded(element: HTMLElement): void {
  scrollIntoView(element, { scrollMode: 'if-needed', block: 'nearest', inline: 'nearest' })
}

export function scrollIntoViewIfNeededById(id: string): void {
  const element = document.getElementById(id)
  if (element) scrollIntoViewIfNeeded(element)
}

export function scrollToTop(element?: HTMLElement): void {
  ;(element || window).scrollTo(0, 0)
}

export enum Key {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  End = 'End',
  Enter = 'Enter',
  Home = 'Home',
  Space = ' ',
  Tab = 'Tab',
}
