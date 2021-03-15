import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http'
import { Controller, HttpRequest, HttpRespose } from '../protocols'
import { EmailValidator } from '../protocols/email-validator'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
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
  }
}
