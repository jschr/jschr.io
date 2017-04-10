import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '1.25rem 0',
    textDecoration: 'none',
    color: '#fff',

    ':hover .icon': {
      transform: 'translateX(1rem)'
    },

    ':hover .text': {
      transform: 'translateX(1.5rem)'
    }
  }),

  icon: css({
    flexShrink: 0,
    height: '3.5rem',
    width: '3.5rem',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    marginRight: '1.25rem',
    marginTop: '0.5rem',
    transform: 'translateX(0rem)',
    transition: 'transform 0.15s ease-in-out'
  }),

  textContainer: css({
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateX(0rem)',
    transition: 'transform 0.15s ease-in-out 0.025s',
  }),

  label: css({
    fontSize: '1.75rem',
    marginBottom: '0.25rem',
    textTransform: 'lowercase'
  }),

  text: css({
    fontSize: '1.375rem',
    color: '#bbb',
    marginBottom: '0.25rem',
    textTransform: 'lowercase'
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
      <div className='icon' {...styles.icon} style={{ backgroundImage: `url(${icon})` }}/>
      <div className='text' {...styles.textContainer}>
        <div {...styles.label}>{ label }</div>
        <div {...styles.text}>{ text }</div>
      </div>
    </a>
  )
}