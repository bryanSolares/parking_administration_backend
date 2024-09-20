import { AuthRepository } from '@src/auth/domain/repository/auth-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(username: string) {
    const userEntity = await this.authRepository.findUserByUsername(username);

    if (!userEntity) throw new AppError('REFRESH_TOKEN_USE_CASE', 401, 'User not found', true);

    const roleDetail = await this.authRepository.getRoleById(userEntity.role as string);
    if (!roleDetail) throw new AppError('REFRESH_TOKEN_USE_CASE', 401, 'Role not found', true);

    return { user: userEntity, role: roleDetail };
  }
}
