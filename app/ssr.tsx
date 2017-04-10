import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderStatic } from 'glamor/server'

import Template, { TemplateProps } from './components/Template'
import App, { AppProps } from './components/App'

export interface HtmlWebpackPlugin {
  files: {
    entry: string
  }
}

export interface SSR {
  cssIds: any
  props: AppProps
}

export default function ssr({ appProps }) {
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
    }
  }

  const html = `
    <!doctype html>
    ${renderToStaticMarkup(<Template {...templateProps} />)}
  `

  return html
}