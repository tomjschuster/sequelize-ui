export function focusById(id: string): void {
  document.getElementById(id)?.focus()
}

export function scrollToTop(element?: HTMLElement): void {
  ;(element || window).scrollTo(0, 0)
}
