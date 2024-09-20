import { Server } from '@src/shared/infrastructure/server/server';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';
const server = new Server();
const logger = new WinstonLogger();

server
  .startServer()
  .then(() => {
    logger.info('Server started');
  })
  .catch(error => {
    /* eslint-disable  no-process-exit */
    logger.error(`Error starting server ${error}`);
    process.exit(1);
  });
