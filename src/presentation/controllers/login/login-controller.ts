import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { AuthenticationError } from '../../errors/authentication-error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpRespose
} from '../../protocols'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.validate(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      if (!accessToken) {
        return unauthorized(new AuthenticationError())
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
