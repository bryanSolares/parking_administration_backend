import { Router } from 'express';
import locationRoutes from './location-routes';
import assignmentRoutes from './assignment-routes';

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
  res.send('');
});

routes.use('/api/v1/parking/', locationRoutes);
routes.use('/api/v1/assignment', assignmentRoutes);

export default routes;
