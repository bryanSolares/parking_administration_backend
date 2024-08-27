import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '@src/auth/application/use-cases/auth/login';
import { RefreshTokenUseCase } from '@src/auth/application/use-cases/auth/refresh-token';

import { createToken } from '../utils/jwt-utils';
import { getPayload } from '../utils/jwt-utils';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  private setAuthCookies(response: Response, token: string, refresh: string) {
    response
      .cookie('token', `Bearer ${token}`, { httpOnly: true, secure: true })
      .cookie('refresh_token', `Bearer ${refresh}`, {
        httpOnly: true,
        secure: true
      });
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;

    try {
      const { user, role } = await this.loginUseCase.run({
        username,
        password
      });

      const payload = {
        user: user.username,
        role: role.name,
        resources: role.resources.map(r => r.slug)
      };

      const { token, refreshToken } = createToken(payload);

      this.setAuthCookies(response, token, refreshToken);
      response.status(200).json({ message: 'Welcome!' });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(request: Request, response: Response, next: NextFunction) {
    const token = (request.cookies['refresh_token'] ?? '') as string;

    try {
      const userData = getPayload(token.split(' ')[1]);

      const { role, user } = await this.refreshTokenUseCase.run(userData!.user);

      const payload = {
        user: user.username,
        role: role.name,
        resources: role.resources.map(r => r.slug)
      };

      const tokens = createToken(payload);

      this.setAuthCookies(response, tokens.token, tokens.refreshToken);
      response.status(200).json({
        message: 'Success!'
      });
    } catch (error) {
      next(error);
    }
  }

  logout(_: Request, response: Response, next: NextFunction) {
    try {
      response
        .status(200)
        .clearCookie('token')
        .clearCookie('refresh_token')
        .json({ message: 'Bye!' });
    } catch (error) {
      next(error);
    }
  }
}
