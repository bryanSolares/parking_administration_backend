import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class FinderById {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new Error('User not found');
    }

    return role;
  }
}
