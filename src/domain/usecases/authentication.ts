import { AccountReturnedByDbModel } from '../models/account-returned-by-db-model'

export type AuthenticationModel = Omit<AccountReturnedByDbModel, 'id'>

export interface Authentication {
  auth: (accountData: AuthenticationModel) => Promise<AccountReturnedByDbModel>
}
