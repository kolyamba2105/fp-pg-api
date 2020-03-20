import AuthService from 'api/auth/auth.service'
import Item from 'api/shopping-lists/items/item.model'
import ShoppingList from 'api/shopping-lists/shopping-list.model'
import ShoppingListService from 'api/shopping-lists/shopping-list.service'
import { Request, Response } from 'express'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import {
  CustomError,
  EndpointResult,
  isIdValid,
  sendResponse,
  sendStatus,
  StatusCode,
  toResponseFromOption,
} from 'utils'

export default class ShoppingListController {
  private static Instance: ShoppingListController

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static get instance(): ShoppingListController {
    if (!ShoppingListController.Instance) {
      ShoppingListController.Instance = new ShoppingListController
    }

    return ShoppingListController.Instance
  }

  getShoppingLists(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader))),
      TE.chain(ShoppingListService.instance.getShoppingLists),
      TE.map(sendResponse(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  getShoppingList(request: Request, response: Response): EndpointResult {
    return pipe(
      sequenceS(E.either)({
        user: AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader)),
        id: isIdValid(request.params.id),
      }),
      TE.fromEither,
      TE.chain(ShoppingListService.instance.getShoppingList),
      TE.map(toResponseFromOption<ShoppingList>(response)('Shopping list not found!')),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  createShoppingList(request: Request, response: Response): EndpointResult {
    return pipe(
      TE.fromEither(AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader))),
      // TODO body validation
      TE.chain((id: number) => ShoppingListService.instance.createShoppingList(id, request.body as ShoppingList)),
      TE.map(sendResponse<ShoppingList>(response)(StatusCode.Created)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  addItemToShoppingList(request: Request, response: Response): EndpointResult {
    return pipe(
      // TODO body validation
      sequenceS(E.either)({
        user: AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader)),
        id: isIdValid(request.params.id),
      }),
      TE.fromEither,
      TE.chain(options => ShoppingListService.instance.addItemToShoppingList({ ...options, dto: request.body })),
      TE.map(sendResponse<Item>(response)(StatusCode.OK)),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  removeShoppingList(request: Request, response: Response): EndpointResult {
    const toResponse = (numberOfRows: number): void =>
      pipe(
        numberOfRows === 0
          ? E.left<CustomError>({ message: 'Shopping list not found!' })
          : E.right(numberOfRows),
        E.fold(
          sendResponse(response)(StatusCode.NotFound),
          sendStatus(response)(StatusCode.NoContent),
        ),
      )

    return pipe(
      sequenceS(E.either)({
        user: AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader)),
        id: isIdValid(request.params.id),
      }),
      TE.fromEither,
      TE.chain(ShoppingListService.instance.removeShoppingList),
      TE.map(toResponse),
      TE.mapLeft(sendResponse<CustomError>(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }

  removeItemFromShoppingList(request: Request, response: Response): EndpointResult {
    const toResponse = (numberOfRows: number): void =>
      pipe(
        numberOfRows === 0
          ? E.left<CustomError>({ message: 'Item not found!' })
          : E.right(numberOfRows),
        E.fold(
          sendResponse<CustomError>(response)(StatusCode.NotFound),
          sendStatus(response)(StatusCode.NoContent),
        ),
      )

    return pipe(
      sequenceS(E.either)({
        user: AuthService.instance.extractIdFromToken(request.header(AuthService.instance.authHeader)),
        id: isIdValid(request.params.id),
        item: isIdValid(request.params.item),
      }),
      TE.fromEither,
      TE.chain(ShoppingListService.instance.removeItemFromShoppingList),
      TE.map(toResponse),
      TE.mapLeft(sendResponse(response)(StatusCode.BadRequest)),
      TE.fold(T.of, T.of),
    )()
  }
}
