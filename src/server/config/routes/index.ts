import { Router } from 'express';
import locationRoutes from '@location-module-infrastructure/routes/location-routes';
import assignmentRoutes from '@assignment-module-infrastructure/routes/assignment-routes';
import tagRoutes from '@src/parameters/infrastructure/routes/tag.routes';
import userRoutes from '@src/auth/infrastructure/routes/user.routes';

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

routes.use('/api/v1/parking/', locationRoutes);
routes.use('/api/v1/assignment', assignmentRoutes);
routes.use('/api/v1/parameter/tag', tagRoutes);
routes.use('/api/v1/parameter/users', userRoutes);

export default routes;
