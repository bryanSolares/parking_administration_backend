import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { AppError } from '@src/server/config/err/AppError';

export class FinderById {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    return role;
  }
}
