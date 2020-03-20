import User, { UserAttributes } from 'api/users/user.model'
import UserRepository from 'api/users/user.repository'
import { genSalt, hash } from 'bcryptjs'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { Map } from 'immutable'
import { CustomError } from 'utils'

export default class UserService {
  private static Instance: UserService

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): UserService {
    if (!UserService.Instance) {
      UserService.Instance = new UserService
    }

    return UserService.Instance
  }

  hashPassword(password: string): T.Task<string> {
    const generateSalt: T.Task<string> = () => genSalt(10)
    const generateHash = (password: string) => (salt: string): T.Task<string> => (): Promise<string> => hash(password, salt)

    return pipe(
      generateSalt,
      T.chain(generateHash(password)),
    )
  }

  getUsers(): TE.TaskEither<CustomError, Map<number, User>> {
    const toUsersMap = (users: ReadonlyArray<User>): Map<number, User> => Map<number, User>(
      A.map((user: User): [number, User] => [user.id, user])(users)
    )

    return pipe(
      UserRepository.instance.getAll(),
      TE.map(toUsersMap),
    )
  }

  getUser(id: number): TE.TaskEither<CustomError, O.Option<User>> {
    return UserRepository.instance.getOne({ id })
  }

  createUser(dto: UserAttributes): TE.TaskEither<CustomError, User> {
    return UserRepository.instance.create(dto)
  }

  updateUser(id: number, payload: Partial<User>): TE.TaskEither<CustomError, [number, ReadonlyArray<User>]> {
    return UserRepository.instance.update(payload)(id)
  }

  removeUser(id: number): TE.TaskEither<CustomError, number> {
    return UserRepository.instance.remove({ id })
  }
}
