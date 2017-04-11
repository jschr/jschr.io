import * as React from 'react'
import { css } from 'glamor'

import SocialLink from './SocialLink'

export interface GithubProps {
  username: string
  summary: {
    following?: string
    commented?: string
    pushed?: string
    commits?: number
  }
}

export default function Github({ username, summary }: GithubProps) {
  const href = `https://github.com/${username}`
  const icon = require('../assets/github.svg')

  let text

  if (summary.following) {
    text = `started following ${summary.following}`
  } else if (summary.commented) {
    text = `commented on ${summary.commented}`
  } else if (summary.pushed) {
    text = `pushed ${summary.commits} commit${summary.commits > 1 ? 's' : ''} to ${summary.pushed}`
  }

  return (
    <SocialLink href={href} icon={icon} label='my code' text={text} color='#4183C4' />
  )
}