import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderStatic } from 'glamor/server'

import Template, { TemplateProps } from './components/Template'
import App, { AppProps } from './components/App'

export interface SSROptions {
  appProps: AppProps
  enableGoogleAnalytics: boolean
  trackingId: string
  enableDevServer: boolean
}

export interface SSR {
  cssIds: any
  props: AppProps
}

export default function ssr(options: SSROptions) {
  const { html: body, css, ids: cssIds } = renderStatic(() => {
    return renderToString(<App {...options.appProps} />)
  })

  const icons = []

  const templateProps = {
    css,
    body,
    ssr: {
      cssIds,
      props: options.appProps
    },
    enableGoogleAnalytics: options.enableGoogleAnalytics,
    trackingId: options.trackingId,
    enableDevServer: options.enableDevServer
  }

  const html = `
    <!doctype html>
    ${renderToStaticMarkup(<Template {...templateProps} />)}
  `

  return html
}