import { config } from 'dotenv'

config()

export default {
  postgres: {
    database: process.env.POSTGRES_DB as string,
    username: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
  },
  auth: {
    secretOrPrivateKey: process.env.AUTH_SECRET || 'key',
  }
}
