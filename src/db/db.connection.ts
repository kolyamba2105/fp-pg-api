import credentials from 'credentials'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { Sequelize } from 'sequelize'
import { CustomError, toError } from 'utils'

type Options = typeof credentials.database

const getSequelizeInstance = ({ database, host, password, username }: Options): Sequelize => new Sequelize({
  database,
  dialect: 'mysql',
  host,
  logging: false,
  password,
  username,
})

export const sequelize = getSequelizeInstance(credentials.database)

export const sync = (sequelize: Sequelize): T.Task<string> =>
  pipe(
    TE.tryCatch(() => sequelize.sync(), toError),
    TE.fold(
      (error: CustomError) => T.of(`Connection failed! ${error.message}`),
      (sequelize: Sequelize) => T.of(`Connected to ${sequelize.config.database}...`),
    ),
  )
