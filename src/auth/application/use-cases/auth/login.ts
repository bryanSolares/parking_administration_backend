import { AuthRepository } from '@src/auth/domain/repository/auth-repository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(user: { username: string; password: string }) {
    return await this.authRepository.login(user);
  }
}
