import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderStatic } from 'glamor/server'

import Template, { TemplateProps } from './components/Template'
import App, { AppProps } from './components/App'

export interface SSROptions {
  appProps: AppProps
  enableGoogleAnalytics: boolean
  trackingId: string
}

export interface SSR {
  cssIds: any
  props: AppProps
}

export default function ssr({ appProps, enableGoogleAnalytics, trackingId }: SSROptions) {
  const { html: body, css, ids: cssIds } = renderStatic(() => {
    return renderToString(<App {...appProps} />)
  })

  const icons = []

  const templateProps = {
    css,
    body,
    ssr: {
      cssIds,
      props: appProps
    },
    enableGoogleAnalytics,
    trackingId
  }

  const html = `
    <!doctype html>
    ${renderToStaticMarkup(<Template {...templateProps} />)}
  `

  return html
}