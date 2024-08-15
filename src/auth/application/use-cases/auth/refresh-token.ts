import { AuthRepository } from '@src/auth/domain/repository/auth-repository';

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async run(username: string) {
    const userEntity = await this.authRepository.findUserByUsername(username);
    if (!userEntity) throw new Error('User not found');

    const roleDetail = await this.authRepository.getRoleById(
      userEntity.role as string
    );
    if (!roleDetail) throw new Error('Role not found');

    return { user: userEntity, role: roleDetail };
  }
}
