import AuthService from 'api/auth/auth.service'
import Category from 'api/categories/category.model'
import CategoryService from 'api/categories/category.service'
import { Request, Response } from 'express'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { CustomError, EndpointResult, isIdValid, sendResponse, sendStatus, StatusCode } from 'utils'

export default class CategoryController {
  private static Instance: CategoryController

  static get instance(): CategoryController {
    if (!CategoryController.Instance) {
      CategoryController.Instance = new CategoryController
    }

    return CategoryController.Instance
  }

  getCategories(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader))),
      TE.chain(CategoryService.instance.getCategories),
      TE.map(sendResponse(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  createCategory(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader))),
      TE.chain((user: number) => CategoryService.instance.createCategory(user, request.body)),
      TE.map(sendResponse<Category>(response)(StatusCode.Created)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  removeCategory(request: Request, response: Response): EndpointResult {
    const toResponse = (numberOfRows: number): void =>
      pipe(
        numberOfRows === 0
          ? E.left<CustomError>({ message: 'Category not found!' })
          : E.right(numberOfRows),
        E.fold(
          sendResponse<CustomError>(response)(StatusCode.NotFound),
          () => sendStatus(response)(StatusCode.NoContent),
        ),
      )

    return pipe(
      sequenceS(E.either)({
        user: AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader)),
        id: isIdValid(request.params.id),
      }),
      TE.fromEither,
      TE.chain(CategoryService.instance.removeCategory),
      TE.map(toResponse),
      TE.mapLeft(sendResponse(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }
}
