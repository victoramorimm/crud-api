import { AccountReturnedByDbModel } from '../models/account-returned-by-db-model'

export interface AddAccountModel {
  email: string
  password: string
}

export interface AddAccount {
  add: (data: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
