import axios from 'axios'

export interface Event {
  subreddit_id: string
  subreddit: string
  score: number
  author: string
  created: number
  title?: string
  permalink?: string
  body?: string
  link_title?: string
  link_author?: string
  link_permalink?: string
}

export type Activity = Event[]

export async function getActivity(username: string): Promise<Activity> {
  const { data: activity } = await axios.get(`https://www.reddit.com/user/${username}/.json`)

  return activity.data.children.map(item => item.data)
}