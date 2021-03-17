import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token'
  }
}))

const secret = 'any_secret'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_value')

      expect(signSpy).toHaveBeenCalledWith({ value: 'any_value' }, secret)
    })

    test('Should return an accessToken on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_value')

      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const accessToken = sut.encrypt('any_value')

      await expect(accessToken).rejects.toThrow()
    })
  })
})
