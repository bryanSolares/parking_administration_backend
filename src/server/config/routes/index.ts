import { Router } from 'express';
import locationRoutes from '@location-module-infrastructure/routes/location-routes';
import assignmentRoutes from '@assignment-module-infrastructure/routes/assignment-routes';
import tagRoutes from '@src/parameters/infrastructure/routes/tag.routes';
import userRoutes from '@src/auth/infrastructure/routes/user.routes';
import roleRoutes from '@src/auth/infrastructure/routes/role.routes';
import authRoutes from '@src/auth/infrastructure/routes/auth.routes';

import { validateAuth } from '@server/middleware/auth-middleware';

const routes = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *       500:
 *         description: Internal server error
 */
routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

routes.use('/api/v1/auth', authRoutes);
routes.use('/api/v1/parking/', /*validateAuth(),*/ locationRoutes);
routes.use('/api/v1/assignment', validateAuth(), assignmentRoutes);
routes.use('/api/v1/parameter/tag', validateAuth(), tagRoutes);
routes.use('/api/v1/parameter/users', validateAuth(), userRoutes);
routes.use('/api/v1/parameter/roles', validateAuth(), roleRoutes);
routes.use('*', (req, res) => res.status(404).json({ message: 'Not found' }));

export default routes;
