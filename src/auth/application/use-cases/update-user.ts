import { RoleEntity } from '@src/auth/domain/entities/role-entity';
import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { UserRepository } from '@src/auth/domain/repository/user-repository';

export class UpdateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async run(user: {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: RoleEntity | string;
  }) {
    const userDatabase = await this.userRepository.getById(user.id);
    const roleDatabase = await this.roleRepository.getById(
      (user.role || '') as string
    );

    if (!userDatabase) {
      throw new Error('User not found');
    }

    if (!roleDatabase) {
      throw new Error('Role not found');
    }

    await this.userRepository.update(user);
  }
}
