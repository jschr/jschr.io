import * as ellipsize from 'ellipsize'

import * as github from './sources/github'
import * as twitter from './sources/twitter'
import * as medium from './sources/medium'

import { AppProps } from './components/App'

export interface Summary {
  text: string
  href: string
}

const TEXT_LENGTH = 100

function stripHtml(str:string): string {
  return str.replace(/(?:https?):\/\/[\n\S]+/g, '')
}

export default async function getProps(): Promise<AppProps> {
  const title = 'Jordan Schroter'
  const description = 'Coder & UX Enthusiast'
  const email = 'hello@jschr.io'
  const githubUsername = 'jschr'
  const twitterUsername = '_jschr'
  const mediumUsername = '_jschr'
  const linkedInUsername = 'jordan-schroter'

  const [ githubActivity, twitterTimeline, mediumStories ] = await Promise.all([
    github.getActivity(githubUsername),
    twitter.getTimeline(twitterUsername),
    medium.getStories(mediumUsername),
  ])

  return {
    title,
    description,
    email,
    socialLinks: [
      {
        icon: 'github.svg',
        color: '#4183c4',
        label: 'my code',
        ...getGithubSummary(githubUsername, githubActivity)
      },
      {
        icon: 'medium.svg',
        color: '#fff',
        label: 'my stories',
        ...getMediumSummary(mediumUsername, mediumStories)
      },
      {
        icon: 'twitter.svg',
        color: '#55acee',
        label: 'my thoughts',
        ...getTwitterSummary(twitterUsername, twitterTimeline)
      },
      {
        icon: 'linkedin.svg',
        color: '#0976b4',
        label: 'my nine-to-five',
        text: 'cto / co-founder at spin.io',
        href: 'https://www.linkedin.com/in/jordan-schroter'
      }
    ]
  }
}

function getGithubSummary(username: string, activity: github.Activity): Summary {
  const allowedEvents = ['WatchEvent', 'IssueCommentEvent', 'PushEvent']
  const latestEvent = activity.find(event => allowedEvents.indexOf(event.type) >= 0)

  const repo = latestEvent.repo.name
  let text

  if (latestEvent.type === 'WatchEvent') {
    text = `started following ${repo}`
  } else if (latestEvent.type === 'IssueCommentEvent') {
    text = `commented on ${repo}`
  } else if (latestEvent.type === 'PushEvent') {
    const commits = latestEvent.payload.commits.length
    text = `pushed ${commits} commit${commits > 1 ? 's' : ''} to ${repo}`
  }

  return {
    text,
    href: `https://github.com/${username}`
  }
}

function getTwitterSummary(username: string, timeline: twitter.Timeline): Summary {
  const latestTweet = timeline[0]

  return {
    text: ellipsize(stripHtml(latestTweet.text), TEXT_LENGTH),
    href: `https://twitter.com/@${username}/status/${latestTweet.id_str}`
  }
}

function getMediumSummary(username: string, stories: medium.Stories): Summary {
  const latestStory = stories[0]

  return {
    text: ellipsize(latestStory.title, TEXT_LENGTH),
    href: latestStory.url
  }
}
