import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12

  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(salt),
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
}
