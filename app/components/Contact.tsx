import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    position: 'fixed',
    bottom: 0,
    right: 0,
    padding: '4% 5%',
    textDecoration: 'none',
    color: '#fff',

    ':hover .underline': {
      transform: 'translateY(0%) scaleY(1)',
    }
  }),

  label: css({
    fontSize: '1.375rem',
    color: '#bbb',
    letterSpacing: '0.05rem',
    marginBottom: '0.5rem'
  }),

  email: css({
    fontSize: '1.75rem',
    letterSpacing: '0.05rem',
    fontWeight: 600
  }),

  textContainer: css({
    position: 'relative'
  }),

  underline: css({
    position: 'absolute',
    bottom: '-0.75rem',
    left: 0,
    right: 0,
    height: 2,
    background: '#fff',
    transform: 'translateY(100%) scaleY(0)',
    transition: 'transform 0.15s ease-in-out',
  })
}

export interface ContactProps {
  email: string
}

export default function Contact({ email }: ContactProps) {
  const href = `mailto:${email}`

  return (
    <a href={href} {...styles.container}>
      <div {...styles.textContainer}>
        <div {...styles.label}>contact me</div>
        <div {...styles.email}>{email}</div>
        <div className='underline' {...styles.underline} />
      </div>
    </a>
  )
}
