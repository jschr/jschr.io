import mount from './mount'
import ssr from './ssr'

if (process.env.BROWSER) mount()

export default ssr