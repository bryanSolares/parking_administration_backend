import jwt from 'jsonwebtoken';
import { config } from '@config/logger/load-envs';

export const createToken = (payload: object) => {
  const token = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP
  });
  const refreshToken = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP_REFRESH
  });

  return {
    token,
    refreshToken
  };
};

export const validateToke = (token: string) => {
  const secret = config.JWT.SECRET;
  return jwt.verify(token, secret);
};

export const getPayload = (token: string) => {
  return jwt.decode(token, {
    json: true
  });
};
