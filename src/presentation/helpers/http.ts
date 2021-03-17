import { HttpRespose } from '../protocols'

export const ok = (data: any): HttpRespose => ({
  statusCode: 200,
  body: data
})

export const badRequest = (error: Error): HttpRespose => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (error: Error): HttpRespose => ({
  statusCode: 401,
  body: error
})

export const serverError = (error: Error): HttpRespose => ({
  statusCode: 500,
  body: error
})
