import { SignUpController } from './signup-controller'

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toEqual(400)
  })
})
