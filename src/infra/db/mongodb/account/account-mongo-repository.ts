import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountReturnedByDbModel } from '../../../../data/models/account-returned-by-db-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '../../../../data/usecases/db-add-account-protocols'
import { AddAccountModel } from '../../../../data/models/add-account-model'

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
