import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { EmailValidator } from '../../protocols'
import { LoginController } from './login-controller'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    class EmailValidatorStub implements EmailValidator {
      validate(email: string): boolean {
        return true
      }
    }

    const emailValidatorStub = new EmailValidatorStub()

    const sut = new LoginController(emailValidatorStub)

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    class EmailValidatorStub implements EmailValidator {
      validate(email: string): boolean {
        return true
      }
    }

    const emailValidatorStub = new EmailValidatorStub()

    const sut = new LoginController(emailValidatorStub)

    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    class EmailValidatorStub implements EmailValidator {
      validate(email: string): boolean {
        return true
      }
    }

    const emailValidatorStub = new EmailValidatorStub()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')

    const sut = new LoginController(emailValidatorStub)

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
