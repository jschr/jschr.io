import * as React from 'react'
import { css, fontFace } from 'glamor'

import Container from './Container'
import Content from './Content'
import Heading from './Heading'
import Contact from './Contact'
import SocialLink, { SocialLinkProps } from './SocialLink'

fontFace({
  fontFamily: 'Lato',
  fontWeight: 400,
  src: `url(${require('../assets/Lato-Regular.ttf')}) format('truetype')`
})

fontFace({
  fontFamily: 'Monsterrat',
  fontWeight: 600,
  src: `url(${require('../assets/Montserrat-Bold.ttf')}) format('truetype')`
})

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
  title: string
  description: string
  email: string
  socialLinks: SocialLinkProps[]
}

export default class App extends React.Component<AppProps, {}> {
  public componentDidMount() {
    // no longer using webfontloader and inlining the fonts in the css
    // to prevent FTOC but leaving this as an example or requiring a lib
    // that depends on browser APIs and breaks ssr

    // only import and load webfont in browser
    // if (typeof document !== 'undefined') {
    //   require('webfontloader').load({
    //     google: {
    //       families: ['Lato:400', 'Monsterat:600']
    //     }
    //   })
    // }
  }

  public render() {
    const {
      title,
      description,
      socialLinks,
      email
    } = this.props

    return (
      <Container>
        <Content>
          <Heading title={title} description={description} />
          { socialLinks.map((props, index) =>
            <SocialLink key={index} {...props} />)
          }
        </Content>
        <Contact email={email} />
      </Container>
    )
  }
}
