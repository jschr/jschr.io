import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { extractCritical } from 'emotion-server'

import Document from './components/Document'
import App, { AppProps } from './components/App'

export interface SSROptions {
  appProps: AppProps
  enableGoogleAnalytics: boolean
  trackingId: string
  enableDevServer: boolean
  webpackStats: any
}

export default function ssr(options: SSROptions) {
  const { html: body, css } = extractCritical(
    renderToString(<App {...options.appProps} />),
  )

  const documentProps = {
    css,
    body,
    enableGoogleAnalytics: options.enableGoogleAnalytics,
    trackingId: options.trackingId,
    enableDevServer: options.enableDevServer,
  }

  const html = `
    <!doctype html>
    ${renderToStaticMarkup(<Document {...documentProps} />)}
  `

  return html
}
