import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
import { LoginUseCase } from '@src/auth/application/use-cases/auth/login';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async login(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;

    try {
      const { token, refresh } = await this.loginUseCase.run({
        username,
        password
      });

      response
        .status(200)
        .cookie('token', `Bearer ${token}`, {
          httpOnly: true,
          secure: true
        })
        .cookie('refresh_token', `Bearer ${refresh}`, {
          httpOnly: true,
          secure: true
        })
        .json({ message: 'Welcome!', token, refresh_token: refresh });
    } catch (error) {
      next(error);
    }
  }
}
