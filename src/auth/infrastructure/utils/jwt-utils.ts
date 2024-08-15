import jwt from 'jsonwebtoken';
import { config } from '@config/logger/load-envs';

export const createToken = (payload: object) => {
  const token = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP,
    audience: 'www.admin-parking.claro.com.gt'
  });
  const refreshToken = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP_REFRESH,
    audience: 'www.admin-parking.claro.com.gt'
  });

  return {
    token,
    refreshToken
  };
};

export const validateToken = (token: string) => {
  try {
    jwt.verify(token, config.JWT.SECRET);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPayload = (token: string) => {
  return jwt.decode(token, {
    json: true
  });
};
