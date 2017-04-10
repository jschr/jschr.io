import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    borderBottom: '2px solid #ff2353',
    marginBottom: '2.5rem'
  }),

  name: css({
    fontSize: '1.75rem',
    fontWeight: 400,
    color: '#bbb',
    marginTop: 0,
    marginBottom: '0.5rem'
  }),

  description: css({
    fontSize: '2.25rem',
    fontFamily: 'Montserrat, Lato, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1rem',
    marginTop: 0,
    marginBottom: '1rem'
  })
}

export interface HeadingProps {
  name: string
  description: string
}

export default function Heading({ name, description }: HeadingProps) {
  return (
    <div {...styles.container}>
      <h1 {...styles.name}>{name}</h1>
      <h2 {...styles.description}>{description}</h2>
    </div>
  )
}