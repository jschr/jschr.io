import axios from 'axios'
import * as Twit from 'twit'
import { promisify } from 'bluebird'
import feed = require('rss-to-json')

import { AppProps } from './components/App'

export interface Options {
  name: string
  description: string
  email: string
  github: string
  twitter: string
  medium: string
  linkedIn: string
  linkedInPosition: string
}

export default async function getProps(opts: Options): Promise<AppProps> {
  const [ githubSummary, twitterSummary, mediumSummary ] = await Promise.all([
    getGithubSummary(opts.github),
    getTwitterSummary(opts.twitter),
    getMediumSummary(opts.medium)
  ])

  return {
    ...opts,
    githubSummary,
    twitterSummary,
    mediumSummary,
    linkedInSummary: { currentPosition: opts.linkedInPosition }
  }
}

async function getGithubSummary(username: string): Promise<any> {
  const { data: activity } = await axios.get(`https://api.github.com/users/${username}/events`)
  const allowedEvents = ['WatchEvent', 'IssueCommentEvent', 'PushEvent']
  const latestEvent = activity.find(event => allowedEvents.indexOf(event.type) >= 0)

  let summary

  if (latestEvent.type === 'WatchEvent') {
    summary = { following: latestEvent.repo.name }
  } else if (latestEvent.type === 'IssueCommentEvent') {
    summary = { commented: latestEvent.repo.name }
  } else if (latestEvent.type === 'PushEvent') {
    summary = { pushed: latestEvent.repo.name, commits: latestEvent.payload.commits.length }
  }

  return summary
}

async function getTwitterSummary(username: string): Promise<any> {
  const twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  const getTweets = promisify<any, {}, {}>(twitter.get, { context: twitter })
  const tweets = await getTweets('statuses/user_timeline', { screen_name: username, include_rts: true })
  const latestTweet = tweets[0]
  const summary = { latestTweetCreatedAt: latestTweet.created_at }

  return summary
}

async function getMediumSummary(username: string): Promise<any> {
  const getFeed = promisify<any, {}>(feed.load, { context: feed })
  const { items: stories } = await getFeed(`https://medium.com/feed/@${username}`)
  const summary = { latestStory: stories[0].title }

  return summary
}
