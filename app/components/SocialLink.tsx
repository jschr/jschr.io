import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2.5rem',
    textDecoration: 'none',
    color: '#fff'
  }),

  icon: css({
    flexShrink: 0,
    height: '3.5rem',
    width: '3.5rem',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    marginRight: '1rem'
  }),

  textContainer: css({
    display: 'flex',
    flexDirection: 'column',
  }),

  label: css({
    fontSize: '1.75rem',
    marginBottom: '0.25rem'
  }),

  text: css({
    fontSize: '1.375rem',
    color: '#bbb',
    marginBottom: '0.25rem'
  })
}

export interface SocialLinkProps {
  icon: string
  label: React.ReactNode
  text: React.ReactNode
  href: string
}

export default function SocialLink({ icon, label, text, href }: SocialLinkProps) {
  return (
    <a href={href} {...styles.container}>
      <div {...styles.icon} style={{ backgroundImage: `url(${icon})` }}/>
      <div {...styles.textContainer}>
        <div {...styles.label}>{ label }</div>
        <div {...styles.text}>{ text }</div>
      </div>
    </a>
  )
}