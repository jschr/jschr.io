import * as React from 'react'
import { css } from 'glamor'

import Container from './Container'
import Content from './Content'
import Heading from './Heading'
import Github from './Github'
import Twitter from './Twitter'
import Medium from './Medium'
import LinkedIn from './LinkedIn'
import Contact from './Contact'

css.global('html', {
  fontSize: '12px',
  height: '100%'
})

// hack to workaround media queries support with css.global
// https://github.com/threepointone/glamor/issues/202
css.insert(`
  @media screen and (max-width: 640px), screen and (max-height: 640px) {
    html {
      font-size: 10px;
    }
  }

  @media screen and (max-width: 480px), screen and (max-height: 480px) {
    html {
      font-size: 9px;
    }
  }

  @media screen and (max-width: 320px), screen and (max-height: 320px) {
    html {
      font-size: 8px;
    }
  }
`)

css.global('body', {
  fontFamily: 'Lato, sans-serif',
  fontWeight: 400,
  color: '#fff',
  backgroundColor: '#2D2D37',
  height: '100%',
  padding: 0,
  margin: 0,
})

css.global('#react-root', {
  height: '100%',
})

export interface AppProps {
  name: string
  description: string
  email: string
  github: string
  githubSummary: any
  twitter: string
  twitterSummary: any
  medium: string
  mediumSummary: any
  linkedIn: string
  linkedInSummary: any
}

export default class App extends React.Component<AppProps, {}> {
  componentDidMount() {
    // only import and load webfont in browser
    if (typeof document !== 'undefined') {
      require('webfontloader').load({
        google: {
          families: ['Lato:400', 'Monsterat:600']
        }
      })
    }
  }

  render() {
    const {
      name,
      email,
      description,
      github,
      githubSummary,
      twitter,
      twitterSummary,
      medium,
      mediumSummary,
      linkedIn,
      linkedInSummary
    } = this.props

    return (
      <Container>
        <Content>
          <Heading name={name} description={description} />
          <Github username={github} summary={githubSummary} />
          <Twitter username={twitter} summary={twitterSummary} />
          <Medium username={medium} summary={mediumSummary} />
          <LinkedIn username={linkedIn} summary={linkedInSummary} />
        </Content>
        <Contact email={email} />
      </Container>
    )
  }
}