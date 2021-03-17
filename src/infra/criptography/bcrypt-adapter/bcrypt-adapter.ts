import bcrypt from 'bcrypt'
import { Hasher } from '../../../data/usecases/signup/db-add-account-protocols'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)

    return hashedValue
  }
}
