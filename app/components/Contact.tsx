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

    ':hover .email': {
      textDecoration: 'underline'
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
  })
}

export interface ContactProps {
  email: string
}

export default function Contact({ email }: ContactProps) {
  const href = `mailto:${email}`

  return (
    <a href={href} {...styles.container}>
      <div {...styles.label}>contact me</div>
      <div className='email' {...styles.email}>{email}</div>
    </a>
  )
}