import * as React from 'react'

import { SSR } from '../ssr'

export interface TemplateProps {
  css: string
  body: string
  ssr: SSR
  enableGoogleAnalytics: boolean
  trackingId: string
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
        { props.enableGoogleAnalytics && props.trackingId &&
          <script dangerouslySetInnerHTML={{ __html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-97192878-1', 'auto');
            ga('send', 'pageview');
          ` }} />
        }
      </body>
    </html>
  )
}