import { AccountReturnedByDbModel } from '../../../domain/models/account-returned-by-db-model'
import { AddAccountModel } from '../../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountReturnedByDbModel>
}
