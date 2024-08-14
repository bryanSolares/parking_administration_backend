import { UserRepository } from '@src/auth/domain/repository/user-repository';

export class FinderById {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
