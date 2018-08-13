import * as React from 'react'
import { css, cx } from 'emotion'
import theme from '../theme'

export interface ButtonProps {
  href?: string
  secondary?: boolean
}

const styles = {
  base: css({
    height: '2.5rem',
    minWidth: '8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    border: `1px solid ${theme.colors.primary}`,
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.sm,
    letterSpacing: 0.6,
    color: theme.colors.background,
    textDecoration: 'none',

    ':hover': {},
  }),

  secondary: css({
    backgroundColor: theme.colors.background,
    color: theme.colors.primary,
    border: `1px solid ${theme.colors.primary}`,
  }),
}

const Button: React.SFC<ButtonProps> = ({
  href = '',
  secondary = false,
  children,
}) => (
  <a className={cx(styles.base, secondary && styles.secondary)} href={href}>
    {children}
  </a>
)

export default Button
