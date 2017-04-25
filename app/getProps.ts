import axios from 'axios'
import * as Twit from 'twit'
import { promisify } from 'bluebird'
import * as ellipsize from 'ellipsize'
import feed = require('rss-to-json')

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
  const github = 'jschr'
  const twitter = '_jschr'
  const medium = '_jschr'
  const linkedIn = 'jordan-schroter'

  const [ githubSummary, twitterSummary, mediumSummary ] = await Promise.all([
    getGithubSummary(github),
    getTwitterSummary(twitter),
    getMediumSummary(medium)
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
        text: githubSummary.text,
        href: githubSummary.href,
      },
      {
        icon: 'medium.svg',
        color: '#fff',
        label: 'my stories',
        text: mediumSummary.text,
        href: mediumSummary.href
      },
      {
        icon: 'twitter.svg',
        color: '#55acee',
        label: 'my thoughts',
        text: twitterSummary.text,
        href: twitterSummary.href
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

async function getGithubSummary(username: string): Promise<Summary> {
  const { data: activity } = await axios.get(`https://api.github.com/users/${username}/events`)
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
    href: `https://github.com/${username}`,
    // uncomment this if you'd prefer to link to the repository of the event rather than your
    // github profile
    // href: `https://github.com/${repo}`
  }
}

async function getTwitterSummary(username: string): Promise<Summary> {
  const twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  const getTweets = promisify<any, {}, {}>(twitter.get, { context: twitter })
  const tweets = await getTweets('statuses/user_timeline', { screen_name: username, include_rts: true })
  const latestTweet = tweets[0]

  return {
    text: ellipsize(stripHtml(latestTweet.text), TEXT_LENGTH),
    href: `https://twitter.com/@${username}/status/${latestTweet.id_str}`
  }
}

async function getMediumSummary(username: string): Promise<Summary> {
  const getFeed = promisify<any, {}>(feed.load, { context: feed })
  const { items: stories } = await getFeed(`https://medium.com/feed/@${username}`)
  const latestStory = stories[0]

  return {
    text: ellipsize(latestStory.title, TEXT_LENGTH),
    href: latestStory.url
  }
}
