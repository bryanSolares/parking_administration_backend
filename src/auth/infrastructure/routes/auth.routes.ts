import { Router } from 'express';
import { authController } from '../dependencies';

import { validateAuth } from '@server/middleware/auth-middleware';

const routes = Router();

routes.post('/login', authController.login.bind(authController));
routes.post(
  '/refresh-token',
  validateAuth('refresh_token'),
  authController.refreshToken.bind(authController)
);
routes.post('/logout', authController.logout.bind(authController));

export default routes;
