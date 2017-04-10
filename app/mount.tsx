import * as React from 'react'
import { render } from 'react-dom'
const rehydrate = require('glamor').rehydrate // missing type definiton for rehydrate

import { SSR } from './ssr'
import App from './components/App'

interface SSRWindow extends Window {
  ssr: SSR
}

export default function () {
  const ssr = (window as SSRWindow).ssr

  rehydrate(ssr.cssIds)
  render(<App {...ssr.props} />, document.getElementById('react-root'))
}
