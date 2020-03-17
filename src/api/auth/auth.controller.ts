import { Auth, Token } from 'api/auth/auth.payload'
import AuthService from 'api/auth/auth.service'
import User from 'api/users/user.model'
import UserRepository from 'api/users/user.repository'
import { NextFunction, Request, Response } from 'express'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { CustomError, EndpointResult, MiddlewareResult, sendResponse, StatusCode, validateBody } from 'utils'

export default class AuthController {
  private static Instance: AuthController

  static get instance(): AuthController {
    if (!AuthController.Instance) {
      AuthController.Instance = new AuthController
    }

    return AuthController.Instance
  }

  authenticate(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(validateBody(Auth.decode)('Invalid request body!')(request.body)),
      TE.chain(AuthService.instance.authenticate),
      TE.map(sendResponse<Token>(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  verify(request: Request, response: Response, next: NextFunction): MiddlewareResult {
    const toResult = (user: O.Option<User>): void =>
      pipe(
        user,
        O.fold(
          () => sendResponse<CustomError>(response)(StatusCode.BadRequest)({ message: 'User not found!' }),
          () => next(),
        )
      )

    return pipe(
      TE.fromEither(AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader))),
      TE.chain(UserRepository.instance.getById),
      TE.map(toResult),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }
}
