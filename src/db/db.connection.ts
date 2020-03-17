import credentials, { Environment } from 'credentials'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { Sequelize } from 'sequelize'
import { CustomError, toError } from 'utils'

type Options = Readonly<{
  database: string,
  username: string,
}>

const getSequelizeInstance = ({ database, username }: Options): Sequelize => new Sequelize({
  database,
  username,
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
})

const getDatabaseName = (environment: Environment): string => environment === 'dev'
  ? credentials.database.devDatabase
  : credentials.database.testDatabase

const options: Options = {
  database: getDatabaseName(credentials.environment),
  username: credentials.database.username,
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
