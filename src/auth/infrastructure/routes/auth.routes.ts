import { Router } from 'express';
import { authController } from '../dependencies';

const routes = Router();

routes.post('/login', authController.login.bind(authController));

export default routes;
