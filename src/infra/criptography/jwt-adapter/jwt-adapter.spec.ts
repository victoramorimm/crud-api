import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const secret = 'any_secret'

      const sut = new JwtAdapter(secret)

      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_value')

      expect(signSpy).toHaveBeenCalledWith({ value: 'any_value' }, secret)
    })

    test('Should return an accessToken on sign success', async () => {
      const secret = 'any_secret'

      const sut = new JwtAdapter(secret)

      const accessToken = await sut.encrypt('any_value')

      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const secret = 'any_secret'

      const sut = new JwtAdapter(secret)

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const accessToken = sut.encrypt('any_value')

      await expect(accessToken).rejects.toThrow()
    })
  })
})
