import { AddAccount } from '../domain/usecases/add-account'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { badRequest, serverError } from '../helpers/http'
import { Controller, HttpRequest, HttpRespose } from '../protocols'
import { EmailValidator } from '../protocols/email-validator'

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
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
