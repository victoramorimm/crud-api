import { AccountReturnedByDbModel } from '../../../domain/models/account-returned-by-db-model'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountReturnedByDbModel>
}
