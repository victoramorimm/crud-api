import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountReturnedByDbModel } from '../../../../data/models/account-returned-by-db-model'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements LoadAccountByEmailRepository {
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
}
