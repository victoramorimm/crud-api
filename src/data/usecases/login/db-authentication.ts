import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../signup/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth(data: AuthenticationModel): Promise<string> {
    const { email } = data

    await this.loadAccountByEmailRepository.loadByEmail(email)

    return null
  }
}
