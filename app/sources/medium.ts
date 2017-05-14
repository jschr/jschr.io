import feed = require('rss-to-json')
import { promisify } from 'bluebird'

export interface Story {
  title: string
  description: string
  link: string
  url: string
  created: number
}

export type Stories = Story[]

export async function getStories(username: string): Promise<Stories> {
  const getFeed = promisify<any, {}>(feed.load, { context: feed })
  const { items: stories } = await getFeed(`https://medium.com/feed/@${username}`)

  return stories
}
