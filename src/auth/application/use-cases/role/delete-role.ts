import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

export class DeleteRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    await this.roleRepository.delete(id);
  }
}
