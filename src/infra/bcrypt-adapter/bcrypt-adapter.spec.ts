import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve('hashed_value'))
  }
}))

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const salt = 12

      const sut = new BcryptAdapter(salt)

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const salt = 12

      const sut = new BcryptAdapter(salt)

      const hashedValue = await sut.hash('any_value')

      expect(hashedValue).toEqual('hashed_value')
    })
  })
})
