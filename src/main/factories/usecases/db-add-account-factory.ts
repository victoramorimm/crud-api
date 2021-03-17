import { DbAddAccount } from '../../../data/usecases/signup/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12

  return new DbAddAccount(
    new AccountMongoRepository(),
    new BcryptAdapter(salt),
    new AccountMongoRepository()
  )
}
