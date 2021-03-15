import { AccountReturnedByDbModel } from '../models/account-returned-by-db-model'

export type AddAccountModel = Omit<AccountReturnedByDbModel, 'id'>

export interface AddAccount {
  add: (data: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
