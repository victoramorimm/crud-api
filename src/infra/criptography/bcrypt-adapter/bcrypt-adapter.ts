import bcrypt from 'bcrypt'
import {
  HashComparer,
  HashComparerModel
} from '../../../data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../data/usecases/signup/db-add-account-protocols'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)

    return hashedValue
  }

  async compare(data: HashComparerModel): Promise<boolean> {
    const { value, valueToCompare } = data

    const isValueValid = await bcrypt.compare(value, valueToCompare)

    return isValueValid
  }
}
