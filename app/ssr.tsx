import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderStatic } from 'glamor/server'

import Template, { TemplateProps } from './components/Template'
import { AppProps } from './components/App'

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

  // use require to ensure glamor rehydrate is called before styles are created
  // https://github.com/threepointone/glamor/issues/64
  const App = require('./components/App').default

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