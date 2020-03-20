import { config } from 'dotenv'

config()

export default {
  database: {
    database: process.env.DATABASE_NAME || 'where-is-my-database-name',
    host: process.env.DATABASE_HOST || 'where-is-my-database-host',
    password: process.env.DATABASE_PASSWORD || 'where-is-my-database-password',
    username: process.env.DATABASE_USERNAME || 'where-is-my-database-username',
  },
  url: process.env.DATABASE_URL || 'where-is-my-url',
  secretOrPrivateKey: process.env.AUTH_SECRET || 'where-is-my-secret-key',
}
