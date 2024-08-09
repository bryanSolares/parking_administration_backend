import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class UpdateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }) {
    const role = await this.roleRepository.getById(data.id);

    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.update(data);
  }
}
