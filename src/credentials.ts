import { config } from 'dotenv'

config()

export type Environment = 'test' | 'dev'

export default {
  environment: process.env.ENV as Environment,
  database: {
    devDatabase: process.env.DEV_DATABASE as string,
    testDatabase: process.env.TEST_DATABASE as string,
    username: process.env.DATABASE_USER as string,
  },
  auth: {
    secretOrPrivateKey: process.env.AUTH_SECRET || 'key',
  }
}
