import { Controller } from '../protocols/controller'
import { HttpRequest, HttpRespose } from '../protocols/http'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    return {
      statusCode: 400,
      body: null
    }
  }
}
