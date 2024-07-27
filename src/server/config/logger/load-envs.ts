import dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 3500,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'dev',
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  MAIL_HOST: process.env.MAIL_HOST ?? 'smtp.gmail.com',
  MAIL_PORT: parseInt(process.env.MAIL_PORT ?? '465'),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD
};
