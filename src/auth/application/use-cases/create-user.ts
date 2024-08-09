import { UserRepository } from '@src/auth/domain/repository/user-repository';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async run(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
  }) {
    await this.userRepository.create(user);
  }
}
