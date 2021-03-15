import { HttpRespose } from '../protocols'

export const badRequest = (error: Error): HttpRespose => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpRespose => ({
  statusCode: 500,
  body: error
})
