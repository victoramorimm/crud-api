import { Controller, HttpRequest, HttpRespose } from '../protocols'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    return {
      statusCode: 400,
      body: 'Missing param: email'
    }
  }
}
