import * as React from 'react'

import { SSR } from '../ssr'

export interface TemplateProps {
  css: string
  body: string
  ssr: SSR
}

export default function Template(props: TemplateProps) {
  const { name, description } = props.ssr.props

  return (
    <html lang='en'>
      <head data-timestamp={(new Date()).toISOString()}>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel='shortcut icon' href={require('../assets/favicon.png')} />
        <title>{`${name} | ${description}`}</title>
        <style>{props.css}</style>
      </head>
      <body>
        <div id='react-root' dangerouslySetInnerHTML={{ __html: props.body }} />
        <script dangerouslySetInnerHTML={{ __html: `window.ssr = ${JSON.stringify(props.ssr)}` }} />
      </body>
    </html>
  )
}