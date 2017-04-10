import * as React from 'react'
import { css } from 'glamor'

import SocialLink from './SocialLink'

export interface MediumProps {
  username: string
  summary: {
   latestStory: string
  }
}

export default function Medium({ username, summary }: MediumProps) {
  const href = `https://medium.com/@${username}`
  const icon = require('../assets/medium.svg')
  const text = <span>wrote about "<em>{summary.latestStory}</em>"</span>

  return (
    <SocialLink href={href} icon={icon} label='my stories' text={text} />
  )
}