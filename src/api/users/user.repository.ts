import User, { UserAttributes } from 'api/users/user.model'
import { Repository } from 'db/repository'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { WhereOptions } from 'sequelize'
import { CustomError, toError } from 'utils'

export default class UserRepository implements Repository<UserAttributes, User> {
  private static Instance: UserRepository

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): UserRepository {
    if (!UserRepository.Instance) {
      UserRepository.Instance = new UserRepository
    }

    return UserRepository.Instance
  }

  create(dto: UserAttributes): TE.TaskEither<CustomError, User> {
    return TE.tryCatch(() => User.create(dto), toError)
  }

  getAll(): TE.TaskEither<CustomError, ReadonlyArray<User>> {
    return TE.tryCatch(() => User.findAll(), toError)
  }

  getById(id: number): TE.TaskEither<CustomError, O.Option<User>> {
    return TE.tryCatch(() => User.findByPk(id).then(O.fromNullable), toError)
  }

  getOne(options: WhereOptions): TE.TaskEither<CustomError, O.Option<User>> {
    return TE.tryCatch(() => User.findOne({ where: options }).then(O.fromNullable), toError)
  }

  remove(options: WhereOptions): TE.TaskEither<CustomError, number> {
    return TE.tryCatch(() => User.destroy({ where: options }), toError)
  }

  update(payload: Partial<User>): (id: number) => TE.TaskEither<CustomError, [number, ReadonlyArray<User>]> {
    return (id: number) => TE.tryCatch(() => User.update(payload, { where: { id }, returning: true }), toError)
  }
}
