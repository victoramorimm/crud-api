import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db-model'
import { AddAccountModel } from '../../domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'
import { AddAccountRepository } from '../protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'

const makeFakeAccountData = (): AddAccountModel => ({
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
      return await new Promise((resolve) => resolve(null))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(data: AddAccountModel): Promise<AccountReturnedByDbModel> {
      return await new Promise((resolve) =>
        resolve(makeFakeAccountReturnedByDb())
      )
    }
  }

  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

  const hasherStub = makeHasherStub()

  const addAccountRepositoryStub = makeAddAccountRepositoryStub()

  const sut = new DbAddAccount(
    loadAccountByEmailRepositoryStub,
    hasherStub,
    addAccountRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.add(makeFakeAccountData())

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeAccountReturnedByDb()))
      )

    const account = await sut.add(makeFakeAccountData())

    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const account = sut.add(makeFakeAccountData())

    await expect(account).rejects.toThrow()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const account = sut.add(makeFakeAccountData())

    await expect(account).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(loadByEmailSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const account = sut.add(makeFakeAccountData())

    await expect(account).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(makeFakeAccountReturnedByDb())
  })
})
