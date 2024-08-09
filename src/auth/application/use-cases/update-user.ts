import { UserRepository } from '@src/auth/domain/repository/user-repository';

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async run(user: {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
  }) {
    const userDatabase = await this.userRepository.getById(user.id);

    if (!userDatabase) {
      throw new Error('User not found');
    }

    await this.userRepository.update(user);
  }
}
