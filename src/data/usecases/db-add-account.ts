import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db-model'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Hasher } from '../protocols/criptography/hasher'
import { AddAccountRepository } from '../protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const { email, password } = accountData

    const isEmailAlreadyInUse = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )

    if (isEmailAlreadyInUse) {
      return null
    }

    const hashedPassword = await this.hasher.hash(password)

    const account = await this.addAccountRepository.add({
      email,
      password: hashedPassword
    })

    return account
  }
}
