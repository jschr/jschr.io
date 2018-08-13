import * as github from './sources/github'
import * as twitter from './sources/twitter'
import * as medium from './sources/medium'
import * as reddit from './sources/reddit'
import { AppProps } from './components/App'

export interface Summary {
  text: string
  href: string
  createdAt: Date
}

export default async function getProps(): Promise<AppProps> {
  const githubUsername = 'jschr'
  const twitterUsername = '_jschr'
  const mediumUsername = '_jschr'
  const redditUsername = 'jschr'

  const [
    githubActivity,
    twitterActivity,
    mediumActivity,
    redditActivity,
  ] = await Promise.all([
    github.getActivity(githubUsername),
    twitter.getTimeline(twitterUsername),
    medium.getStories(mediumUsername),
    reddit.getActivity(redditUsername),
  ])

  return {
    githubActivity,
    twitterActivity,
    mediumActivity,
    redditActivity,
  }
}
