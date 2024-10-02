import { ForeignKeyConstraintError } from 'sequelize';
import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    try {
      await this.roleRepository.delete(id);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError)
        throw new AppError('ROLE_HAS_RELATIONS', 400, 'You can not delete a role with active users', true);

      throw error;
    }
  }
}
