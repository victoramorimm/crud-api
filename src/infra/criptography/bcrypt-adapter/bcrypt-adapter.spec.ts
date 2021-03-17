import bcrypt from 'bcrypt'
import { HashComparerModel } from '../../../data/protocols/criptography/hash-comparer'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve('hashed_value'))
  },

  async compare(): Promise<boolean> {
    return await new Promise((resolve) => resolve(true))
  }
}))

export const makeFakeDataToCompare = (): HashComparerModel => ({
  value: 'any_value',
  valueToCompare: 'hashed_value'
})

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

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare(makeFakeDataToCompare())

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
    })

    test('Should return false if compare returns false', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

      const isValueValid = await sut.compare(makeFakeDataToCompare())

      expect(isValueValid).toBeFalsy()
    })

    test('Should return true if compare returns true', async () => {
      const sut = makeSut()

      const isValueValid = await sut.compare(makeFakeDataToCompare())

      expect(isValueValid).toBeTruthy()
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const isValueValid = sut.compare(makeFakeDataToCompare())

      await expect(isValueValid).rejects.toThrow()
    })
  })
})
