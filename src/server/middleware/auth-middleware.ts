import { NextFunction, Request, Response } from 'express';
import { validateToken } from '@src/auth/infrastructure/utils/jwt-utils';
import { AppError } from '../config/err/AppError';

export const validateAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const tokenBearer = request.cookies['token'] as string;

    if (!tokenBearer) {
      throw new AppError(
        'AUTHORIZATION_NOT_PROVIDED',
        401,
        'Token not provided',
        true
      );
    }
    const tokenHeader = tokenBearer?.split(' ')[1];
    if (!validateToken(tokenHeader)) {
      throw new AppError('INVALID_TOKEN', 403, 'Invalid token', true);
    }
    next();
  } catch (error) {
    next(error);
  }
};
