import axios from 'axios'

export interface Artist {
  name: string
  href: string
  type: string
  external_urls: {
    spotify: string
  }
  uri: string
}

export interface CurrentlyPlaying {
  timestamp: number
  progress_ms: number
  is_playing: boolean
  item: {
    name: string,
    artists: Artist[],
    type: string
    preview_url: string
    popularity: number
    uri: string
    track_number: number
    external_urls: {
      spotify: string
    }
    album: {
      album_type: string
      available_markets: string[]
      external_urls: {
        spotify: string
      }
      href: string
    }
  }
  context: {
    type: string
    uri: string
    href: string
    external_urls: {
      spotify: string
    }
  }
}

async function getAccessToken(): Promise<string> {
  const payload = `refresh_token=${process.env.SPOTIFY_REFRESH_TOKEN}&grant_type=refresh_token`

  const { data } = await axios.post('https://accounts.spotify.com/api/token', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.SPOTIFY_CLIENT_ID,
      password: process.env.SPOTIFY_CLIENT_SECRET
    }
  })

  return data.access_token
}

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying> {
  const accessToken = await getAccessToken()

  const { data } = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data
}
