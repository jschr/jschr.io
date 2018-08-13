import * as React from 'react'
import { css } from 'emotion'
import theme from '../theme'

export interface IndentProps {}

const styles = {
  base: css({
    display: 'flex',
    fontFamily: theme.fonts.monospace,
    fontWeight: 300,
    fontSize: theme.fontSizes.sm,
    marginTop: 0,
    color: theme.colors.text,
    lineHeight: 1.35,
  }),

  icon: css({
    marginRight: theme.gutters.sm,
    color: theme.colors.muted,
    opacity: 0.5,
  }),

  content: css({}),
}

const Indent: React.SFC<IndentProps> = ({ children }) => {
  return (
    <p className={styles.base}>
      <span className={styles.icon}>></span>
      <span className={styles.content}>{children}</span>
    </p>
  )
}

export default Indent
