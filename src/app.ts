import { Server } from '@server/server';
import { logger } from '@config/logger/load-logger';

const server = new Server();
server
  .startServer()
  .then(() => {
    logger().info('Server started');
  })
  .catch(error => {
    logger().error('Error starting server', error);
  });
