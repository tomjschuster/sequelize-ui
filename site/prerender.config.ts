import { PrerenderConfig } from '@stencil/core'

export const config: PrerenderConfig = {
  hydrateOptions(_url) {
    return {
      prettyHtml: true,
    }
  },
}
