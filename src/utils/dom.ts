export function focusById(id: string): void {
  document.getElementById(id)?.focus()
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
