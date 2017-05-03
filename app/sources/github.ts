import axios from 'axios'

export interface Event {
  id: string
  type: string
  actor: {
    id: number
    login: string
    gravatar_id: string
    url: string
    avatar_url: string
  }
  repo: {
    id: number
    name: string
    url: string
  }
  payload: any
  created_at: string
}

export type Activity = Event[]

export async function getActivity(username: string): Promise<Activity> {
  const { data: activity } = await axios.get(`https://api.github.com/users/${username}/events`)

  return activity
}