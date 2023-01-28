import { AuthDto } from './dto'

export class AuthService {
  signup({ email, password }: AuthDto) {
    const user = { id: 1, email }

    console.log({ ...user, password })

    return user
  }

  login() {
    const message = { message: 'Login method' }
    console.log(message)

    return message
  }
}
