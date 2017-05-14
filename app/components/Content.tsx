import * as React from 'react'
import { css } from 'glamor'

const styles = {
  content: css({
    boxSizing: 'border-box',
    width: '100%',
    padding: '2.5rem',
    maxWidth: '54rem'
  })
}

export interface ContentProps {
  children?: React.ReactNode
}

export default function Content({ children }: ContentProps) {
  return (
    <div {...styles.content}>
      { children }
    </div>
  )
}
