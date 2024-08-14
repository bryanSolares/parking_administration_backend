import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class CreateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: {
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
    listOfAccess: [];
  }) {
    const resources = await this.roleRepository.getResources();

    const resourceIds = new Set(resources.map(res => res.id));

    data.listOfAccess.forEach(
      (access: { resource: string; can_access: boolean }) => {
        if (!resourceIds.has(access.resource)) {
          throw new Error(`Resource not found: ${access.resource}`);
        }
      }
    );

    await this.roleRepository.create(data);
  }
}
