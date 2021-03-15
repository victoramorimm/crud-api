import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http'
import { HttpRequest, HttpRespose } from '../protocols'
import { SignUpController } from './signup-controller'

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new SignUpController()

    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse: HttpRespose = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new SignUpController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse: HttpRespose = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const sut = new SignUpController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse: HttpRespose = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  test('Should return 400 if passwordConfirmation is different of the password', async () => {
    const sut = new SignUpController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_password'
      }
    }

    const httpResponse: HttpRespose = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })
})
