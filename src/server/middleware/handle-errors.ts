/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from 'express';
import { Response } from 'express';
import { ErrorRequestHandler } from 'express';
import { NextFunction } from 'express';
import { AppError } from '../config/err/AppError';

export const handleErrors = (
  err: ErrorRequestHandler | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    if (err.isOperational) {
      return res.status(err.httpCode).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal server error' });
};
