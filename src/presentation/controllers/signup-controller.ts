import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http'
import { Controller, HttpRequest, HttpRespose } from '../protocols'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    const requiredFields = ['email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { password, passwordConfirmation } = httpRequest.body

    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }
  }
}
