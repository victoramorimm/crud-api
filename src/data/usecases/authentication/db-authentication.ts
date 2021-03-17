import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../signup/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(data: AuthenticationModel): Promise<string> {
    const { email, password } = data

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (!account) {
      return null
    }

    const isPasswordValid = await this.hashComparer.compare({
      value: password,
      valueToCompare: account.password
    })

    if (!isPasswordValid) {
      return null
    }

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.updateAccessToken({
      accessToken,
      id: account.id
    })

    return accessToken
  }
}
