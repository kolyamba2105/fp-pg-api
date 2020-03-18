import { AuthCredentials, AuthPayload, Token } from 'api/auth/auth.payload'
import User from 'api/users/user.model'
import UserRepository from 'api/users/user.repository'
import { compare } from 'bcrypt'
import credentials from 'credentials'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { decode, sign } from 'jsonwebtoken'
import { CustomError, isIdValid } from 'utils'

export default class AuthService {
  private static Instance: AuthService

  private AuthHeader = 'Authorization'

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): AuthService {
    if (!AuthService.Instance) {
      AuthService.Instance = new AuthService
    }

    return AuthService.Instance
  }

  get authHeader(): string {
    return AuthService.Instance.AuthHeader
  }

  private static comparePasswords(password: string, user: User): T.Task<boolean> {
    return (): Promise<boolean> => compare(password, user.password)
  }

  private static generateToken(user: User): string {
    return sign({ id: user.id, email: user.email }, credentials.secretOrPrivateKey)
  }

  authenticate(payload: AuthCredentials): TE.TaskEither<CustomError, Token> {
    const genericError: CustomError = { message: 'Invalid auth credentials!' }

    const toResult = (password: string) => (user: User): TE.TaskEither<CustomError, Token> =>
      pipe(
        AuthService.comparePasswords(password, user),
        T.map((isPasswordCorrect: boolean) => isPasswordCorrect
          ? E.right({ token: AuthService.generateToken(user) })
          : E.left(genericError)
        ),
      )

    return pipe(
      UserRepository.instance.getOne({ email: payload.email }),
      TE.chain(TE.fromOption(() => genericError)),
      TE.chain(toResult(payload.password)),
    )
  }

  extractIdFromToken(token: string | undefined): E.Either<CustomError, number> {
    const toId = (payload: unknown): E.Either<CustomError, number> =>
      pipe(
        O.fromNullable(payload),
        O.mapNullable((payload: AuthPayload) => payload.id),
        E.fromOption(() => ({ message: 'Invalid token!' }))
      )

    return pipe(
      E.fromNullable({ message: 'Token is not provided!' })(token),
      E.map(decode),
      E.chain(toId),
      E.chain(isIdValid),
    )
  }
}
