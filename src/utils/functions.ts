/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
function identity<T>(x: T): T {
  return x
}

interface UnaryFunction<T, R> {
  (source: T): R
}

export function pipe(): typeof identity
export function pipe<T, A>(fn1: UnaryFunction<T, A>): UnaryFunction<T, A>
export function pipe<T, A, B>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
): UnaryFunction<T, B>
export function pipe<T, A, B, C>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
): UnaryFunction<T, C>
export function pipe<T, A, B, C, D>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
): UnaryFunction<T, D>
export function pipe<T, A, B, C, D, E>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
): UnaryFunction<T, E>
export function pipe<T, A, B, C, D, E, F>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
): UnaryFunction<T, F>
export function pipe<T, A, B, C, D, E, F, G>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
): UnaryFunction<T, G>
export function pipe<T, A, B, C, D, E, F, G, H>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
): UnaryFunction<T, H>
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
  fn9: UnaryFunction<H, I>,
): UnaryFunction<T, I>
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  fn1: UnaryFunction<T, A>,
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
  fn9: UnaryFunction<H, I>,
  ...fns: UnaryFunction<any, any>[]
): UnaryFunction<T, unknown>

export function pipe(...fns: Array<UnaryFunction<any, any>>): UnaryFunction<any, any> {
  return pipeFromArray(fns)
}

function pipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> {
  if (fns.length === 0) {
    return identity as UnaryFunction<any, any>
  }

  if (fns.length === 1) {
    return fns[0]
  }

  return function piped(input: T): R {
    return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any)
  }
}

export function noop(): void {
  return void 0
}

export function void_(_v: unknown): void {
  return undefined
}

export function debounce<T extends (...args: any[]) => any>(
  f: T,
  wait: number,
  immediate: boolean = false,
): ((...args: Parameters<T>) => void) & { cancel: () => boolean } {
  let timeout: NodeJS.Timeout | undefined

  function cancel(): boolean {
    if (timeout) {
      clearTimeout(timeout)
      return true
    }

    return false
  }

  const debounced = function (...args: Parameters<T>): void {
    cancel()
    timeout = setTimeout(function () {
      timeout = undefined
      if (!immediate) return f(...args)
    }, wait)
    if (immediate && !timeout) return f(...args)
  }

  debounced.cancel = cancel

  return debounced
}
