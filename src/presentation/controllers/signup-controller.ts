import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  async handle(httpRequest: any): Promise<any> {
    return {
      statusCode: 400
    }
  }
}
