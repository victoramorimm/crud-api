import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
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

  test('Should return 200 on login', async () => {
    const password = await hash('123456', 12)

    await accountCollection.insertOne({
      email: 'victoramorim@gmail.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'victoramorim@gmail.com',
        password: '123456'
      })
      .expect(200)
  })

  test('Should return 401 on login', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'victoramorim@gmail.com',
        password: '123456'
      })
      .expect(401)
  })
})
