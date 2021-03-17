import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

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

      await accountCollection.insertOne({
        email: 'any_email@mail.com',
        password: 'hashed_password'
      })

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
})
