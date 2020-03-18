import { config } from 'dotenv'

config()

export default {
  url: process.env.DATABASE_URL || 'where-is-my-url',
  secretOrPrivateKey: process.env.AUTH_SECRET || 'where-is-my-secret-key',
}
