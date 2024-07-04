import dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 3500,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'dev'
};
