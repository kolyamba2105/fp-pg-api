import * as t from 'io-ts'

export const Auth = t.type({
  email: t.string,
  password: t.string,
})

export type AuthCredentials = t.TypeOf<typeof Auth>

export type AuthPayload = Readonly<{ id: number, email: string }>

export type Token = Readonly<{ token: string }>
