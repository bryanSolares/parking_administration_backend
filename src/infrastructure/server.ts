import http from 'node:http';
import { AddressInfo } from 'node:net';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/logger/load-envs';
import { logger } from './config/logger/load-logger';
import { sequelizeConnection } from '../mooc/infrastructure/database/sequelize';

import locationRoutes from './routes/LocationRoutes';

export class Server {
  private readonly app: express.Application;
  private server?: http.Server;

  constructor() {
    this.app = express();
    this.loadMiddlewares();
    this.loadRoutes();
  }

  private loadMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors({}));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan(config.LOG_LEVEL));
  }

  //Load routes
  private loadRoutes() {
    this.app.get('/api/v1/health', (req, res) => {
      res.send('');
    });

    this.app.use('/api/v1/locations', locationRoutes);
  }

  public startServer(): Promise<void> {
    return new Promise(resolve => {
      this.server = this.app.listen(config.PORT, () => {
        const { port, address } = this.server?.address() as AddressInfo;
        logger().info(`Server running on port ${address}:${port}`);
        sequelizeConnection()
          .then(message => {
            logger().info(message);
          })
          .catch(error => {
            logger().error(error);
          });
        resolve();
      });
    });
  }

  public stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server?.close(error => {
        if (error) {
          logger().error('Error closing server', error);
          reject(error);
        }
        logger().info('Server closed');
        resolve();
      });
    });
  }
}
