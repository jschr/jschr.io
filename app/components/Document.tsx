import * as React from 'react'

export interface DocumentProps {
  css: string
  body: string
  enableGoogleAnalytics: boolean
  trackingId: string
  enableDevServer: boolean
}

const Document: React.SFC<DocumentProps> = ({
  css,
  body,
  trackingId,
  enableGoogleAnalytics,
  enableDevServer,
}) => (
  <html lang="en" data-timestamp={new Date().toISOString()}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="shortcut icon" href={require('../assets/favicon.png')} />
      <link
        href="https://fonts.googleapis.com/css?family=Merriweather:300,700"
        rel="stylesheet"
      />
      <title>Jordan Schroter | Full Stack Developer</title>
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <div id="react-root" dangerouslySetInnerHTML={{ __html: body }} />
      {enableGoogleAnalytics &&
        trackingId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', '${trackingId}', 'auto');
            ga('send', 'pageview');
          `,
            }}
          />
        )}
      {enableDevServer && (
        <script src="http://localhost:8080/webpack-dev-server.js" />
      )}
    </body>
  </html>
)

export default Document
