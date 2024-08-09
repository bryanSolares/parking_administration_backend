import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class CreateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: {
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }) {
    await this.roleRepository.create(data);
  }
}
