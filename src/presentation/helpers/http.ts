import { HttpRespose } from '../protocols'

export const badRequest = (error: Error): HttpRespose => ({
  statusCode: 400,
  body: error
})
