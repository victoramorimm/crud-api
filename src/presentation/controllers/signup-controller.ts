import { Controller, HttpRequest, HttpRespose } from '../protocols'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpRespose> {
    const requiredFields = ['email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: `Missing param: ${field}`
        }
      }
    }
  }
}
