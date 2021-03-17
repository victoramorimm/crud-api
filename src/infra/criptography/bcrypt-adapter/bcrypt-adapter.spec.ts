import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve('hashed_value'))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hashedValue = await sut.hash('any_value')

      expect(hashedValue).toBe('hashed_value')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const hashedValue = sut.hash('any_value')

      await expect(hashedValue).rejects.toThrow()
    })
  })
})
