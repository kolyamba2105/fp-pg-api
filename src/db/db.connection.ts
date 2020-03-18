import credentials from 'credentials'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { Sequelize } from 'sequelize'
import { CustomError, toError } from 'utils'

type Options = typeof credentials.postgres

const getSequelizeInstance = ({ database, username, password }: Options): Sequelize => new Sequelize({
  database,
  username,
  password,
  // Use 'postgres' when running with docker-compose
  host: 'postgres',
  dialect: 'postgres',
  logging: false,
})

const { postgres: { database, username, password } } = credentials

const options: Options = {
  database,
  username,
  password,
}

export const sequelize = getSequelizeInstance(options)

export const sync = (sequelize: Sequelize): T.Task<string> =>
  pipe(
    TE.tryCatch(() => sequelize.sync(), toError),
    TE.fold(
      (error: CustomError) => T.of(`Failed to synchronize! ${error.message}`),
      (sequelize: Sequelize) => T.of(`Synchronized successfully! ${sequelize.config.database}`),
    ),
  )
