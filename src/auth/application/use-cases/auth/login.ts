import { AuthRepository } from '@src/auth/domain/repository/auth-repository';
import { AppError } from '@src/server/config/err/AppError';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(user: { username: string; password: string }) {
    const userEntity = await this.authRepository.findUserByUsername(user.username);
    if (!userEntity) throw new AppError('USER_NOT_FOUND', 401, 'User not found', true);

    if (!userEntity.role) throw new AppError('ROLE_NOT_FOUND', 401, 'User have no role assigned', true);

    // TODO: WebService

    const roleDetail = await this.authRepository.getRoleById(userEntity.role as string);

    if (!roleDetail) throw new AppError('ROLE_NOT_FOUND', 401, 'Role not found', true);

    if (roleDetail.status === 'INACTIVO')
      throw new AppError('ROLE_ASSIGNED_INACTIVE', 401, 'Role assigned to user is inactive', true);

    return { user: userEntity, role: roleDetail };
  }
}
