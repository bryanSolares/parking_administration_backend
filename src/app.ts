import { Server } from '@server/server';
import { logger } from '@config/logger/load-logger';
const server = new Server();
server
  .startServer()
  .then(() => {
    logger().info('Server started');
  })
  .catch(error => {
    /* eslint-disable  no-process-exit */
    logger().error('Error starting server', error);
    process.exit(1);
  });
