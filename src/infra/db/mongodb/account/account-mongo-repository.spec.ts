import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const makeInsertAccountOnInMemoryDb = async (): Promise<any> => {
  return await accountCollection.insertOne({
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = new AccountMongoRepository()

      await makeInsertAccountOnInMemoryDb()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = new AccountMongoRepository()

      const account = await sut.add({
        email: 'any_email@mail.com',
        password: 'hashed_password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = new AccountMongoRepository()

      const result = await makeInsertAccountOnInMemoryDb()

      const accountReturnedByDb = result.ops[0]

      const { _id } = accountReturnedByDb

      await sut.updateAccessToken({
        id: _id,
        accessToken: 'any_token'
      })

      const account = await accountCollection.findOne({ _id })

      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })
})
