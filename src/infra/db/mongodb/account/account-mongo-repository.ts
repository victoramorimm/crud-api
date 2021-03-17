import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../../../data/protocols/db/update-access-token-repository'
import {
  LoadAccountByEmailRepository,
  AccountReturnedByDbModel,
  MongoHelper,
  AddAccountRepository,
  AddAccountModel
} from './account-mongo-repository-protocols'

export class AccountMongoRepository
  implements
    LoadAccountByEmailRepository,
    AddAccountRepository,
    UpdateAccessTokenRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.makeAdapterForTheAccountIdReturnedByDb(account)
    }

    return null
  }

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const account = result.ops[0]

    return MongoHelper.makeAdapterForTheAccountIdReturnedByDb(account)
  }

  async updateAccessToken(data: UpdateAccessTokenModel): Promise<void> {
    const { id, accessToken } = data

    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          accessToken
        }
      }
    )

    return await new Promise((resolve) => resolve())
  }
}
