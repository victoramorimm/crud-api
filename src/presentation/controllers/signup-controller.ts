import { Controller, HttpRequest, HttpRespose } from '../protocols'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: 'Missing param: email'
      }
    }

    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: 'Missing param: password'
      }
    }
  }
}
