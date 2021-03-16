import {
  LoadAccountByEmailRepository,
  AccountReturnedByDbModel,
  MongoHelper,
  AddAccountRepository,
  AddAccountModel
} from './account-mongo-repository-protocols'

export class AccountMongoRepository
  implements LoadAccountByEmailRepository, AddAccountRepository {
  async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const accountReturnedByDb = await accountCollection.findOne({ email })

    if (accountReturnedByDb) {
      const account = await MongoHelper.makeAdapterForTheAccountIdReturnedByDb(
        accountReturnedByDb
      )

      return account
    }

    return null
  }

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountReturnedByDb = result.ops[0]

    const account = await MongoHelper.makeAdapterForTheAccountIdReturnedByDb(
      accountReturnedByDb
    )

    return account
  }
}
