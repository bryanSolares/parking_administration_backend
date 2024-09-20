import { RoleEntity } from '@src/auth/domain/entities/role-entity';
import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { UserRepository } from '@src/auth/domain/repository/user-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

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
    const roleDatabase = await this.roleRepository.getById((user.role || '') as string);

    if (!userDatabase) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found', true);
    }

    if (!roleDatabase) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    await this.userRepository.update(user);
  }
}
