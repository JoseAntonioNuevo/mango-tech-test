import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
}
