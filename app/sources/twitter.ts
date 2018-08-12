import * as Twit from 'twit'
import { promisify } from 'bluebird'

const twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

export interface User {
  id: number
  id_str: string
  name: string
  screen_name: string
  location: string
  description: string
  url: string
  followers_count: number
  favorites_count: number
  statuses_count: number
  profile_background_color: string
  profile_background_image_url: string
  profile_background_image_url_https: string
  profile_background_tile: boolean
  profile_image_url: string
  profile_image_url_https: string
  profile_banner_url: string
  profile_link_color: string
  profile_sidebar_border_color: string
  profile_sidebar_fill_color: string
  profile_text_color: string
  following: boolean
}

export interface Tweet {
  id: number
  id_str: string
  text: string
  truncated: boolean
  source: string
  in_reply_to_status_id?: number
  in_reply_to_status_id_str?: string
  in_reply_to_user_id?: string
  in_reply_to_user_id_str?: string
  in_reply_to_user_screen_name?: string
  retweet_count: number
  retweeted: boolean
  favorite_count: number
  favorited: boolean
  possibly_sensitive: false
  lang: string
  user: User
  retweeted_status: Tweet
  created_at: string
}

export type Timeline = Tweet[]

export async function getTimeline(username: string): Promise<Timeline> {
  const getTweets = promisify<any, {}, {}>(twitter.get, { context: twitter })
  const tweets = await getTweets('statuses/user_timeline', {
    screen_name: username,
    include_rts: true,
  })

  return tweets
}
