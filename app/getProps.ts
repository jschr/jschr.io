import * as ellipsize from 'ellipsize'

import * as github from './sources/github'
import * as twitter from './sources/twitter'
import * as medium from './sources/medium'
import * as reddit from './sources/reddit'
import * as spotify from './sources/spotify'

import { AppProps } from './components/App'

export interface Summary {
  text: string
  href: string
  createdAt: Date
}

const TEXT_LENGTH = 100

function stripHtml(str: string): string {
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
  const linkedInPosition = 'engineer @ getmira.com'
  const redditUsername = 'jschr'
  const spotifyPlaylistUri = 'spotify:user:_jschr:playlist:6SQWPySZnyi30YIR2GfZti'

  const [
    githubActivity,
    twitterTimeline,
    mediumStories,
    redditActivity,
    spotifyCurrentlyPlaying
  ] = await Promise.all([
    github.getActivity(githubUsername),
    twitter.getTimeline(twitterUsername),
    medium.getStories(mediumUsername),
    reddit.getActivity(redditUsername),
    spotify.getCurrentlyPlaying()
  ])

  // sort social links sorted by most recent and take the top 3
  const socialLinks = [
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
      icon: 'reddit.svg',
      color: '#ff4500',
      label: 'my interests',
      ...getRedditSummary(redditUsername, redditActivity)
    }
  ]
    .sort((a, b) => +b.createdAt - +a.createdAt)
    .slice(0, 3)

  // if spotify is currently playing add it otherwise add linkedin
  if (spotifyCurrentlyPlaying.is_playing) {
    socialLinks.push({
      icon: 'spotify.svg',
      color: '#1ed760',
      label: 'my favourite tracks',
      ...getSpotifySummary(spotifyPlaylistUri, spotifyCurrentlyPlaying)
    })
  } else {
    socialLinks.push({
      icon: 'linkedin.svg',
      color: '#0976b4',
      label: 'my nine-to-five',
      text: linkedInPosition,
      href: 'https://www.linkedin.com/in/jordan-schroter',
      createdAt: new Date()
    })
  }

  return {
    title,
    description,
    email,
    socialLinks
  }
}

function getGithubSummary(username: string, activity: github.Activity): Summary {
  const allowedEvents = ['WatchEvent', 'IssueCommentEvent', 'PushEvent']
  const latestEvent = activity.find((event) => allowedEvents.indexOf(event.type) >= 0)

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
    createdAt: new Date(latestEvent.created_at)
  }
}

function getTwitterSummary(username: string, timeline: twitter.Timeline): Summary {
  const latestTweet = timeline[0]

  return {
    text: ellipsize(stripHtml(latestTweet.text), TEXT_LENGTH),
    href: `https://twitter.com/@${username}/status/${latestTweet.id_str}`,
    createdAt: new Date(latestTweet.created_at)
  }
}

function getMediumSummary(username: string, stories: medium.Stories): Summary {
  const latestStory = stories[0]

  return {
    text: ellipsize(latestStory.title, TEXT_LENGTH),
    href: latestStory.url,
    createdAt: new Date(latestStory.created)
  }
}

function getRedditSummary(username: string, activity: reddit.Activity): Summary {
  const allowedSubreddits = ['web_design', 'webdev', 'reactjs', 'entrepreneur', 'startups', 'tech', 'technology', 'userexperience', 'aws', 'devops', 'programming', 'chromeos', 'javascript'] // tslint:disable-line
  const latestEvent = activity.find((event) => allowedSubreddits.indexOf(event.subreddit) >= 0)

  let href
  let text

  if (latestEvent.permalink) {
    text = latestEvent.title
    href = latestEvent.permalink
  } else if (latestEvent.link_permalink) {
    text = latestEvent.link_title
    href = latestEvent.link_permalink
  }

  return {
    text,
    href,
    createdAt: new Date(latestEvent.created * 1000)
  }
}

function getSpotifySummary(playlistUri: string, currentlyPlaying: spotify.CurrentlyPlaying): Summary {
  return {
    text: `${currentlyPlaying.item.name} by ${currentlyPlaying.item.artists[0].name}`,
    // hardcoded playlist uri, replace with your own public playlist or
    // use currentlyPlaying.item.uri if you'd prefer to use the track uri
    href: playlistUri,
    createdAt: new Date()
  }
}
