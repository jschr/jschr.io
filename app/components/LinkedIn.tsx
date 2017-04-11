import * as React from 'react'
import { css } from 'glamor'

import SocialLink from './SocialLink'

export interface LinkedInProps {
  username: string
  summary: {
    currentPosition: string
  }
}

export default function LinkedIn({ username, summary }: LinkedInProps) {
  const href = `https://www.linkedin.com/in/${username}`
  const icon = require('../assets/linkedin.svg')
  const text = `currently ${summary.currentPosition}`

  return (
    <SocialLink href={href} icon={icon} label='my nine-to-five' text={text} color='#0976B4' />
  )
}