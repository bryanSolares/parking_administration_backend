import http from 'node:http';
import { AddressInfo } from 'node:net';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import { config } from '@config/logger/load-envs';
import { logger } from '@config/logger/load-logger';
import { sequelizeConnection } from '@config/database/sequelize';
import { sequelize } from '@config/database/sequelize';
import swaggerDocs from '@config/swagger/openapi.json';
import '@config/database/models/relations';

import { handleErrors } from '@server/middleware/handle-errors';

import routes from '@routes/index';

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
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan(config.LOG_LEVEL));
  }

  //Load routes
  private loadRoutes() {
    this.app.use(
      '/api/v1/docs/',
      swaggerUI.serve,
      swaggerUI.setup(swaggerDocs)
    );
    this.app.use(routes);
    this.app.use(handleErrors);
  }

  public startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      sequelizeConnection()
        .then(message => {
          this.server = this.app.listen(config.PORT, () => {
            const { port, address } = this.server?.address() as AddressInfo;
            logger().info(`Server running on port ${address}:${port}`);
            logger().info(message);
            resolve();
          });
        })
        .catch(error => {
          logger().error(error);
          reject(error);
        });
    });
  }

  public stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server?.close(async error => {
        if (error) {
          logger().error('Error closing server', error);
          reject(error);
        }
        await sequelize.close();
        logger().info('Server closed');
        resolve();
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
