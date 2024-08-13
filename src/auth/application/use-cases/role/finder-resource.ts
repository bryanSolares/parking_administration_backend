import { RoleRepository } from '@src/auth/domain/repository/role-repository';

export class FinderResource {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run() {
    return await this.roleRepository.getResources();
  }
}
