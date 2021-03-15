import validator from 'validator'
import { EmailValidator } from '../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  validate(email: string): boolean {
    validator.isEmail(email)

    return null
  }
}
