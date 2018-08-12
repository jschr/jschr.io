import * as React from 'react'
import * as ellipsize from 'ellipsize'
import { AllHtmlEntities } from 'html-entities'
import { injectGlobal, css } from 'emotion'
import * as stripHtml from 'striptags'
import { Activity as GithubActivity } from '../sources/github'
import { Timeline as TwitterTimeline } from '../sources/twitter'
import { Stories as MediumStories } from '../sources/medium'
import { Activity as RedditActivity } from '../sources/reddit'
import theme from '../theme'
import Button from './Button'
import Heading from './Heading'
import Indent from './Indent'
import Link from './Link'
import Text from './Text'

export interface AppProps {
  githubActivity: GithubActivity
  twitterActivity: TwitterTimeline
  mediumActivity: MediumStories
  redditActivity: RedditActivity
}

injectGlobal({
  '*, *:before, *:after': {
    boxSizing: 'border-box',
  },

  html: {
    fontSize: theme.fontSizes.root,
  },

  body: {
    display: 'flex',
    fontFamily: theme.fonts.serif,
    margin: 0,
    background: theme.colors.background,
  },

  '#react-root': {
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  },
})

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 700,
    padding: theme.gutters.lg,

    ' > *': {
      marginBottom: theme.gutters.lg,
    },
    ' > *:last-child': {
      marginBottom: 0,
    },
  }),

  details: css({
    display: 'flex',
    flexDirection: 'column',

    ' > *': {
      marginBottom: theme.gutters.md,
    },
    ' > *:last-child': {
      marginBottom: 0,
    },
  }),

  actions: css({
    display: 'flex',

    ' > *': {
      marginRight: theme.gutters.sm,
    },
    ' > *:last-child': {
      marginRight: 0,
    },
  }),
}

const entities = new AllHtmlEntities()

const App: React.SFC<AppProps> = ({
  githubActivity,
  twitterActivity,
  mediumActivity,
  redditActivity,
}) => {
  const allowedGithubEvents = ['WatchEvent', 'IssueCommentEvent', 'PushEvent']
  const latestGithubEvent = githubActivity.find(
    event => allowedGithubEvents.indexOf(event.type) >= 0,
  )

  const githubRepo = latestGithubEvent.repo.name
  let githubLabel

  if (latestGithubEvent.type === 'WatchEvent') {
    githubLabel = 'started following'
  } else if (latestGithubEvent.type === 'IssueCommentEvent') {
    githubLabel = 'commented on'
  } else if (latestGithubEvent.type === 'PushEvent') {
    const commits = latestGithubEvent.payload.commits.length
    githubLabel =
      commits > 0
        ? `pushed ${commits} commit${commits > 1 ? 's' : ''} to`
        : `pushed to`
  }

  const latestMediumArticle = mediumActivity.find(
    // Hack to filter out replies.
    story => stripHtml(story.description).length > 600,
  )

  const allowedSubreddits = [
    'web_design',
    'webdev',
    'reactjs',
    'entrepreneur',
    'startups',
    'tech',
    'technology',
    'userexperience',
    'aws',
    'devops',
    'programming',
    'chromeos',
    'javascript',
  ]

  const latestRedditComment = redditActivity.find(
    event => allowedSubreddits.indexOf(event.subreddit) >= 0,
  )

  const latestTweet = twitterActivity.find(
    tweet => !tweet.in_reply_to_status_id,
  )

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <Heading>Hi, I'm Jordan.</Heading>
        <Text>A full-stack developer who recently—</Text>
        <Indent>
          {githubLabel}{' '}
          <Link href={`https://github.com/${githubRepo}`}>{githubRepo}</Link>
        </Indent>
        <Indent>
          wrote about{' '}
          <Link href={latestMediumArticle.link}>
            "{latestMediumArticle.title}"
          </Link>
        </Indent>
        <Indent>
          commented on{' '}
          <Link href={latestRedditComment.link_permalink}>
            "{latestRedditComment.link_title}"
          </Link>
        </Indent>
        <Indent>
          tweeted{' '}
          <Link
            href={`https://twitter.com/@${
              latestTweet.user.screen_name
            }/status/${latestTweet.id_str}`}
          >
            "{ellipsize(entities.decode(stripHtml(latestTweet.text)), 100)}"
          </Link>
        </Indent>
      </div>
      <Text>
        I'm currently building cool stuff at{' '}
        <Link href="https://www.getmira.com">Mira</Link>.
      </Text>
      <div className={styles.actions}>
        <Button href="https://github.com/jschr">My Github</Button>
        <Button href="mailto:hello@jschr.io" secondary>
          Contact Me
        </Button>
      </div>
    </div>
  )
}

export default App
