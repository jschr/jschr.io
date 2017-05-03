import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    borderBottom: '2px solid #ff2353',
    marginBottom: '1.25rem'
  }),

  title: css({
    fontSize: '1.75rem',
    fontWeight: 400,
    color: '#bbb',
    marginTop: 0,
    marginBottom: '0.5rem',

    '@media screen and (max-width: 480px), screen and (max-height: 480px)': {
      fontSize: '1.5rem',
    }
  }),

  description: css({
    fontSize: '2.25rem',
    fontFamily: 'Montserrat, Lato, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1rem',
    marginTop: 0,
    marginBottom: '1rem',

    '@media screen and (max-width: 480px), screen and (max-height: 480px)': {
      fontSize: '2rem',
    }
  })
}

export interface HeadingProps {
  title: string
  description: string
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div {...styles.container}>
      <h1 {...styles.title}>{title}</h1>
      <h2 {...styles.description}>{description}</h2>
    </div>
  )
}