import * as React from 'react'
import { css, cx } from 'emotion'
import theme from '../theme'

export interface TextProps {
  muted?: boolean
}

const styles = {
  base: css({
    fontFamily: theme.fonts.serif,
    fontWeight: 300,
    fontSize: theme.fontSizes.md,
    marginTop: 0,
    color: theme.colors.text,
  }),

  muted: css({
    color: theme.colors.muted,
  }),
}

const Text: React.SFC<TextProps> = ({ muted = false, children }) => {
  return <p className={cx(styles.base, muted && styles.muted)}>{children}</p>
}

export default Text
