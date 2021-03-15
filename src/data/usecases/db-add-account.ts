import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db-model'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const { email, password } = accountData

    const isEmailAlreadyInUse = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )

    if (isEmailAlreadyInUse) {
      return null
    }

    await this.hasher.hash(password)
  }
}
