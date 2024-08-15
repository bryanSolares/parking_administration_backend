import { UserRepository } from '@src/auth/domain/repository/user-repository';
import { AppError } from '@src/server/config/err/AppError';

export class FinderById {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found', true);
    }

    return user;
  }
}
