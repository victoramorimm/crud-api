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

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toBe('Missing param: email')
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new SignUpController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse: HttpRespose = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toBe('Missing param: password')
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

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toBe('Missing param: passwordConfirmation')
  })
})
