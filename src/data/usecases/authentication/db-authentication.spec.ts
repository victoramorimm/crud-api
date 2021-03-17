import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/criptography/encrypter'
import {
  HashComparer,
  HashComparerModel
} from '../../protocols/criptography/hash-comparer'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../protocols/db/update-access-token-repository'
import {
  AccountReturnedByDbModel,
  LoadAccountByEmailRepository
} from '../signup/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAuthenticationData = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccountReturnedByDb = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
      return await new Promise((resolve) =>
        resolve(makeFakeAccountReturnedByDb())
      )
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(data: HashComparerModel): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(
      data: UpdateAccessTokenModel
    ): Promise<AccountReturnedByDbModel> {
      return await new Promise((resolve) =>
        resolve(makeFakeAccountReturnedByDb())
      )
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

  const hashComparerStub = makeHashComparerStub()

  const encrypterStub = makeEncrypterStub()

  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.auth(makeFakeAuthenticationData())

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const accessToken = await sut.auth(makeFakeAuthenticationData())

    expect(accessToken).toBeNull()
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const account = sut.auth(makeFakeAuthenticationData())

    await expect(account).rejects.toThrow()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthenticationData())

    expect(compareSpy).toHaveBeenCalledWith({
      value: 'any_password',
      valueToCompare: 'hashed_password'
    })
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.auth(makeFakeAuthenticationData())

    expect(accessToken).toBeNull()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })

    const account = sut.auth(makeFakeAuthenticationData())

    await expect(account).rejects.toThrow()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthenticationData())

    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })

    const account = sut.auth(makeFakeAuthenticationData())

    await expect(account).rejects.toThrow()
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateAccessTokenSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    await sut.auth(makeFakeAuthenticationData())

    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      id: 'any_id'
    })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const account = sut.auth(makeFakeAuthenticationData())

    await expect(account).rejects.toThrow()
  })

  test('Should return an accessToken on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthenticationData())

    expect(accessToken).toBe('any_token')
  })
})
