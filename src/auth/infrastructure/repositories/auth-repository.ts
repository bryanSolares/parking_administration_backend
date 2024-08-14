import { AuthRepository } from '@src/auth/domain/repository/auth-repository';
import { UserModel } from '@config/database/models/auth/user.model';
import { RoleRepository } from '@src/auth/domain/repository/role-repository';
import { createToken } from '../utils/jwt-utils';
import { AppError } from '@src/server/config/err/AppError';

export class AuthJWTRepository implements AuthRepository {
  constructor(private readonly roleRepository: RoleRepository) {}

  async login(data: {
    username: string;
    password: string;
  }): Promise<{ token: string; refresh: string }> {
    const userDatabase = await UserModel.findOne({
      where: { username: data.username }
    });
    if (!userDatabase)
      throw new AppError('USER_NOT_FOUND', 401, 'User not found', true);

    //TODO: SOAPServer

    const userEntity = userDatabase.get({ plain: true });

    const roleDetail = await this.roleRepository.getById(
      userEntity.role_id as string
    );

    const payload = {
      user: data.username,
      role: roleDetail!.name,
      resources: roleDetail!.resources.map(r => r.slug)
    };

    const { token, refreshToken } = createToken(payload);
    return { token, refresh: refreshToken };
  }
}
