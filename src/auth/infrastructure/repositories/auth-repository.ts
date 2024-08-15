import { AuthRepository } from '@src/auth/domain/repository/auth-repository';
import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { UserModel } from '@config/database/models/auth/user.model';
import { UserEntity } from '@src/auth/domain/entities/user-entity';
import { RoleEntity } from '@src/auth/domain/entities/role-entity';

export class AuthJWTRepository implements AuthRepository {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({ where: { username } });
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives({
      ...userDatabase.get({ plain: true }),
      role: userDatabase.get({ plain: true }).role_id
    });
  }

  async getRoleById(roleId: string): Promise<RoleEntity | null> {
    return await this.roleRepository.getById(roleId);
  }
}
