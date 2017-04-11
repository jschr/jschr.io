import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderStatic } from 'glamor/server'

import Template, { TemplateProps } from './components/Template'
import App, { AppProps } from './components/App'

export interface SSROptions {
  appProps: AppProps
  enableGoogleAnalytics: boolean
  trackingId: string
  enableDevServer: boolean,
  webpackStats: any
}

export interface SSR {
  cssIds: any
  props: AppProps
}

export default function ssr(options: SSROptions) {
  const assets = Object.keys(options.webpackStats.compilation.assets)
  const js = assets.filter(value => value.match(/\.js$/))
  const { html: body, css, ids: cssIds } = renderStatic(() => {
    return renderToString(<App {...options.appProps} />)
  })

  const templateProps = {
    css,
    js,
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