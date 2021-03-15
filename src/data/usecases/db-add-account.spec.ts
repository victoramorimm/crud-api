import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db-model'
import { AddAccountModel } from '../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'

const makeFakeAccountData = (): AddAccountModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccountReturnedByDb = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'any_password'
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

type SutTypes = {
  sut: DbAddAccount
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

  const sut = new DbAddAccount(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
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
})
