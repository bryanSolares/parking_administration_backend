import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@server/middleware/auth-middleware';
import { loginSchema } from '../utils/auth-zod-schemas';
import { validateRequest } from '@shared/zod-validator';

const routes = Router();

routes.post('/login', validateRequest(loginSchema, 'body'), authController.login.bind(authController));
routes.post('/refresh-token', validateAuth('refresh_token'), authController.refreshToken.bind(authController));
routes.post('/logout', authController.logout.bind(authController));

export default routes;
