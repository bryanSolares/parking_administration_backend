import { Router } from 'express';
import locationRoutes from '@location-module-infrastructure/routes/location-routes';
import assignmentRoutes from '@assignment-module-infrastructure/routes/assignment-routes';
import tagRoutes from '@src/parameters/infrastructure/routes/tag.routes';
import userRoutes from '@src/auth/infrastructure/routes/user.routes';
import roleRoutes from '@src/auth/infrastructure/routes/role.routes';
import authRoutes from '@src/auth/infrastructure/routes/auth.routes';

//import { validateAuth } from '@server/middleware/auth-middleware';

const routes = Router();

routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

routes.use('/api/v1/auth', authRoutes);
routes.use('/api/v1/parking/', /*validateAuth(),*/ locationRoutes);
routes.use('/api/v1/assignment', /*validateAuth(),*/ assignmentRoutes);
routes.use('/api/v1/parameter/tag', /*validateAuth(),*/ tagRoutes);
routes.use('/api/v1/parameter/users', /*validateAuth(),*/ userRoutes);
routes.use('/api/v1/parameter/roles', /*validateAuth(),*/ roleRoutes);
routes.use('*', (_, res) => res.status(400).json({ message: 'You have an invalid endpoint' }));

export default routes;
