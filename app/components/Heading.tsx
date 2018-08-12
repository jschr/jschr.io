import * as React from 'react'
import { css } from 'emotion'
import theme from '../theme'

const styles = css({
  fontFamily: theme.fonts.serif,
  fontWeight: 700,
  fontSize: theme.fontSizes.lg,
  margin: 0,
  color: theme.colors.text,
})

const Heading: React.SFC<{}> = ({ children }) => (
  <h1 className={styles}>{children}</h1>
)

export default Heading
