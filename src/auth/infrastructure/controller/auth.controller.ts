import { Request } from 'express';
import { Response } from 'express';
import { LoginUseCase } from '@src/auth/application/use-cases/auth/login';
import { AppError } from '@src/server/config/err/AppError';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async login(request: Request, response: Response) {
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
        .json({ message: 'Welcome!' });
    } catch (error) {
      if (error instanceof AppError) {
        console.log({
          error_name: error.name,
          operational: error.isOperational
        });
        return response.status(error.httpCode).json({ message: error.message });
      }

      console.log(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}
