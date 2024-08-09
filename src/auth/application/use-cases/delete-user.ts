import { UserRepository } from '@src/auth/domain/repository/user-repository';

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string) {
    const userDatabase = await this.userRepository.getById(id);

    if (!userDatabase) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }
}
