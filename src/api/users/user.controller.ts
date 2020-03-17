import User from 'api/users/user.model'
import UserService from 'api/users/user.service'
import { Request, Response } from 'express'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { CustomError, EndpointResult, isIdValid, sendResponse, sendStatus, StatusCode } from 'utils'

export default class UserController {
  private static Instance: UserController

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): UserController {
    if (!UserController.Instance) {
      UserController.Instance = new UserController
    }

    return UserController.Instance
  }

  getUsers(_: Request, response: Response): EndpointResult {
    return pipe(
      UserService.instance.getUsers(),
      TE.map(sendResponse<ReadonlyMap<number, User>>(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  getUser(request: Request, response: Response): EndpointResult {
    const toResponse = (user: O.Option<User>): void =>
      pipe(
        user,
        O.fold(
          () => sendResponse(response)(StatusCode.NotFound)({ message: 'User not found!' }),
          sendResponse(response)(StatusCode.OK),
        ),
      )

    return pipe(
      TE.fromEither(isIdValid(request.params.id)),
      TE.chain(UserService.instance.getUser),
      TE.map(toResponse),
      TE.mapLeft(sendResponse(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  createUser(request: Request, response: Response): EndpointResult {
    return pipe(
      UserService.instance.createUser(request.body),
      TE.map(sendResponse<User>(response)(StatusCode.Created)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  updateUser(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(isIdValid(request.params.id)),
      TE.chain((id: number) => UserService.instance.updateUser(id, request.body)),
      TE.map((result: [number, ReadonlyArray<User>]) => ({ result })),
      TE.map(sendResponse<{ result: [number, ReadonlyArray<User>] }>(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  removeUser(request: Request, response: Response): EndpointResult {
    const toResponse = (numberOfRows: number): void =>
      pipe(
        numberOfRows === 0
          ? E.left<CustomError>({ message: 'User not found!' })
          : E.right(numberOfRows),
        E.fold(
          sendResponse<CustomError>(response)(StatusCode.NotFound),
          sendStatus(response)(StatusCode.NoContent),
        ),
      )

    return pipe(
      TE.fromEither(isIdValid(request.params.id)),
      TE.chain(UserService.instance.removeUser),
      TE.map(toResponse),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }
}
