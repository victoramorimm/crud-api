import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db-model'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
        const fakeAccount = {
          id: 'any_id',
          email: 'any_email@mail.com',
          password: 'any_password'
        }

        return await new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const sut = new DbAddAccount(loadAccountByEmailRepositoryStub)

    await sut.add({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
