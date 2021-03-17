export interface UpdateAccessTokenModel {
  accessToken: string
  id: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (data: UpdateAccessTokenModel) => Promise<void>
}
