import { HttpRespose } from '../protocols'

export const badRequest = (message: string): HttpRespose => ({
  statusCode: 400,
  body: message
})
