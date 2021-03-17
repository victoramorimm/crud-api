import {
  AccountReturnedByDbModel,
  LoadAccountByEmailRepository
} from '../signup/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccountReturnedByDb = (): AccountReturnedByDbModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
      return await new Promise((resolve) =>
        resolve(makeFakeAccountReturnedByDb())
      )
    }
  }

  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
