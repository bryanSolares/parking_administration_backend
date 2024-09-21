import { RoleEntity } from '@src/contexts/auth/core/entities/role-entity';
import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async run(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: RoleEntity | string;
  }) {
    const roleDatabase = await this.roleRepository.getById((user.role || '') as string);

    if (!roleDatabase) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    await this.userRepository.create(user);
  }
}
