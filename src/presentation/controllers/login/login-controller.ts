import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpRespose
} from '../../protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    const isEmailValid = this.emailValidator.validate(email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
