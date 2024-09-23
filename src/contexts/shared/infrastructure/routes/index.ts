import { Router } from 'express';
import locationRoutes from '@src/contexts/location/infrastructure/routes/location-routes';
import assignmentRoutes from '@src/contexts/assignment/infrastructure/routes/assignment-routes';
import tagRoutes from '@src/contexts/parameters/infrastructure/routes/tag.routes';
import userRoutes from '@src/contexts/auth/infrastructure/routes/user.routes';
import roleRoutes from '@src/contexts/auth/infrastructure/routes/role.routes';
import authRoutes from '@src/contexts/auth/infrastructure/routes/auth.routes';
import settingRoutes from '@src/contexts/parameters/infrastructure/routes/setting.routes';

//import { validateAuth } from '@server/middleware/auth-middleware';

const routes = Router();

routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

routes.use('/api/v1/auth', authRoutes);
routes.use('/api/v1/parking/', /*validateAuth(),*/ locationRoutes);
routes.use('/api/v1/assignment', /*validateAuth(),*/ assignmentRoutes);
routes.use('/api/v1/parameter/tag', /*validateAuth(),*/ tagRoutes);
routes.use('/api/v1/parameter/settings', /*validateAuth(),*/ settingRoutes);
routes.use('/api/v1/parameter/users', /*validateAuth(),*/ userRoutes);
routes.use('/api/v1/parameter/roles', /*validateAuth(),*/ roleRoutes);
routes.use('*', (_, res) => res.status(400).json({ message: 'You have an invalid endpoint' }));

export default routes;
