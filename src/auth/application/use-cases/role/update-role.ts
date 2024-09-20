import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { AppError } from '@src/server/config/err/AppError';

export class UpdateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: { id: string; name: string; description: string; status: 'ACTIVO' | 'INACTIVO'; listOfAccess: [] }) {
    const role = await this.roleRepository.getById(data.id);

    if (!role) {
      throw new Error('Role not found');
    }

    const resources = await this.roleRepository.getResources();
    const resourceIds = new Set(resources.map(res => res.id));
    data.listOfAccess.forEach((access: { resource: string; can_access: boolean }) => {
      if (!resourceIds.has(access.resource)) {
        throw new AppError('RESOURCE_NOT_FOUND', 400, `Resource not found: ${access.resource}`, true);
      }
    });

    await this.roleRepository.update(data);
  }
}
