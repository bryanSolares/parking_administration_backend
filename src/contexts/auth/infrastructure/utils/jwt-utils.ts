import jwt from 'jsonwebtoken';
import { config } from '@src/server/config/env/envs';

interface JwtPayload {
  user: string;
  role: string;
  resources: string[];
  iat: number;
  exp: number;
  aud: string;
}

interface DecodedJwt {
  header: {
    alg: string;
    typ: string;
  };
  payload: JwtPayload;
  signature: string;
}

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

export const getPayload = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token, {
    json: true,
    complete: true
  }) as DecodedJwt | null;

  if (decoded && decoded.payload) {
    return decoded.payload;
  }

  return null;
};
