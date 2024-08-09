import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class DeleteRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.delete(id);
  }
}
