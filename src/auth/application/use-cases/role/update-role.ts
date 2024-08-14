import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class UpdateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
    listOfAccess: [];
  }) {
    const role = await this.roleRepository.getById(data.id);

    if (!role) {
      throw new Error('Role not found');
    }

    const resources = await this.roleRepository.getResources();
    const resourceIds = new Set(resources.map(res => res.id));
    data.listOfAccess.forEach(
      (access: { resource: string; can_access: boolean }) => {
        if (!resourceIds.has(access.resource)) {
          throw new Error(`Resource not found: ${access.resource}`);
        }
      }
    );

    await this.roleRepository.update(data);
  }
}
