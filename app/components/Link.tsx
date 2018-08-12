import * as React from 'react'
import { css } from 'emotion'
import theme from '../theme'

export interface LinkProps {
  href?: string
}

const styles = css({
  color: theme.colors.primary,
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
})

const Link: React.SFC<LinkProps> = ({ href = '', children }) => (
  <a className={styles} href={href}>
    {children}
  </a>
)

export default Link
