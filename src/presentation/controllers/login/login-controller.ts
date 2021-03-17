import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { Controller, HttpRequest, HttpRespose } from '../../protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    return badRequest(new MissingParamError('email'))
  }
}
