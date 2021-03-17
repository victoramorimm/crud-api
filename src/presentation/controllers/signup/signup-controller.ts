import { AddAccount } from './signup-controller-protocols'
import {
  EmailAlreadyInUseError,
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http'
import {
  Controller,
  HttpRequest,
  HttpRespose,
  EmailValidator
} from '../../protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    try {
      const requiredFields = ['email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { password, passwordConfirmation, email } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.validate(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        email,
        password
      })

      if (!account) {
        return badRequest(new EmailAlreadyInUseError())
      }

      return ok(account)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
