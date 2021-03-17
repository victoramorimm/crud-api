import {
  AccountReturnedByDbModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

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
