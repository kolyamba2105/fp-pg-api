import { Response } from 'express'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'

export enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export type CustomError = {
  readonly message: string,
}

export type EndpointResult = Promise<void>

export type MiddlewareResult = EndpointResult

export const sendResponse = <T>(response: Response) => (statusCode: StatusCode) => (content: T) => {
  response.status(statusCode).send(content)
}

export const sendStatus = (response: Response) => (statusCode: StatusCode) => () => {
  response.sendStatus(statusCode)
}

export const toError = ({ message }: Error): CustomError => ({ message })

export const isIdValid = (id: unknown): E.Either<CustomError, number> => !isNaN(Number(id))
  ? E.right(Number(id))
  : E.left({ message: 'Invalid ID!' })

export const validateBody = <T>(decoder: (input: unknown) => t.Validation<T>) => (message: string) => (input: unknown): E.Either<CustomError, T> =>
  pipe(
    decoder(input),
    E.mapLeft(() => ({ message })),
  )
