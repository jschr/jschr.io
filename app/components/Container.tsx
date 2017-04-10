import * as React from 'react'
import { css } from 'glamor'

const styles = {
  container: css({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  })
}

export interface ContainerProps {
  children?: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div {...styles.container}>
      { children }
    </div>
  )
}