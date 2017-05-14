import * as React from 'react'
import { css } from 'glamor'
import { XmlEntities } from 'html-entities'

const entities = new XmlEntities()

const styles = {
  container: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '1.25rem 0',
    textDecoration: 'none',
    color: '#fff',

    ':hover .icon': {
      transform: 'translateX(1.25rem)'
    },

    ':hover .text': {
      transform: 'translateX(1.25rem)'
    },

    ':hover .underline': {
      transform: 'translateX(0%) scaleX(1)',
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
  }),

  underline: css({
    position: 'absolute',
    bottom: '-0.75rem',
    left: 0,
    right: 0,
    height: 2,
    transform: 'translateX(-50%) scaleX(0)',
    transition: 'transform 0.15s ease-in-out 0.025s',
  })
}

export interface SocialLinkProps {
  icon: string
  label: string
  text: string
  href: string
  color: string
}

export default function SocialLink({ icon, label, text, href, color }: SocialLinkProps) {
  return (
    <a href={href} {...styles.container}>
      <div className='icon' {...styles.icon} style={{ backgroundImage: `url(${require(`../assets/${icon}`)})` }}/>
      <div className='text' {...styles.textContainer}>
        <div {...styles.label}>{ label }</div>
        <div {...styles.text}>{ entities.decode(text) }</div>
        <div className='underline' {...styles.underline} style={{ backgroundColor: color }} />
      </div>
    </a>
  )
}
