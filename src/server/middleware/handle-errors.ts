/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from 'express';
import { Response } from 'express';
import { ErrorRequestHandler } from 'express';
import { NextFunction } from 'express';
import { AppError } from '../config/err/AppError';
import { logger } from '@config/logger/load-logger';

export const handleErrors = (
  err: ErrorRequestHandler | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof AppError) {
    if (err.isOperational) {
      logger().info(err);
      return res.status(err.httpCode).json({ message: err.message });
    }
    logger().warn(err);
    return res.status(500).json({ message: err.message });
  }
  logger().error(err);
  res.status(500).json({ message: 'Internal server error' });
};
