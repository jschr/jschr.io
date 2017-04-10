import * as React from 'react'
import { css } from 'glamor'
import * as moment from 'moment'

import SocialLink from './SocialLink'

export interface TwitterProps {
  username: string
  summary: {
   latestTweetCreatedAt: string
  }
}

export default function Twitter({ username, summary }: TwitterProps) {
  const href = `https://twitter.com/@${username}`
  const icon = require('../assets/twitter.svg')
  const text = `tweeted ${moment(summary.latestTweetCreatedAt).fromNow()}`

  return (
    <SocialLink href={href} icon={icon} label='my thoughts' text={text} />
  )
}