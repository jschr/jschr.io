import axios from 'axios'
import { promisify } from 'util'
import xml2js = require('xml2js')

const parser = new xml2js.Parser({
  trim: false,
  normalize: true,
})
const xmlToJson = promisify(parser.parseString.bind(parser))

export interface Story {
  title: string
  description: string
  link: string
  created: Date
}

export type Stories = Story[]

export async function getStories(username: string): Promise<Stories> {
  const { data: xml } = await axios.get(`https://medium.com/feed/@${username}`)
  const json = await xmlToJson(xml)
  return json.rss.channel[0].item.map(item => ({
    title: item.title[0],
    description: item['content:encoded'][0],
    link: item.link[0],
    created: new Date(item.pubDate[0]),
  }))
}
