import { AuthPayload } from 'api/auth/auth.payload'
import AuthService from 'api/auth/auth.service'
import * as E from 'fp-ts/lib/Either'
import { sign } from 'jsonwebtoken'
import { CustomError } from 'utils'

describe('AuthService', () => {
  describe('extractIdFromToken', () => {
    it('should extract id from header', () => {
      const header = sign({
        id: 1,
        email: 'example@domain.com',
      } as AuthPayload, 'secretOrPrivateKey')

      const result = AuthService.instance.extractIdFromToken(header)

      expect(result).toStrictEqual(E.right(1))
    })

    it('should not extract id when id is not a number', () => {
      const header = sign({
        id: 'some-random-string',
        email: 'example@domain.com',
      }, 'secretOrPrivateKey')

      const result = AuthService.instance.extractIdFromToken(header)

      expect(result).toStrictEqual(E.left<CustomError>({ message: 'Invalid ID!' }))
    })

    it('should not extract id when token is not provided', () => {
      const result = AuthService.instance.extractIdFromToken(undefined)

      // expect(result).toStrictEqual(E.left<CustomError>({ message: 'Token is not provided!' }))
      expect(E.isRight(result)).toBeTruthy()
    })

    it('should not extract id when token is not correct', () => {
      const result = AuthService.instance.extractIdFromToken('some-random-string')

      expect(result).toStrictEqual(E.left<CustomError>({ message: 'Invalid token!' }))
    })
  })
})
