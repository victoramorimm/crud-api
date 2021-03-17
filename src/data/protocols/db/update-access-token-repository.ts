import { AccountReturnedByDbModel } from '../../../domain/models/account-returned-by-db-model'

export interface UpdateAccessTokenModel {
  accessToken: string
  id: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    data: UpdateAccessTokenModel
  ) => Promise<AccountReturnedByDbModel>
}
