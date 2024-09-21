import http from 'node:http';
import { AddressInfo } from 'node:net';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from '@src/server/config/env/envs';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';
import { sequelizeConnection } from '@src/server/config/database/sequelize';
import { sequelize } from '@src/server/config/database/sequelize';
import '@contexts/shared/infrastructure/models/relations';

import { handleErrors } from '@src/server/middleware/handle-errors';

import routes from '@src/contexts/shared/infrastructure/routes/index';

export class Server {
  private readonly app: express.Application;
  private server?: http.Server;
  private logger: WinstonLogger;

  constructor() {
    this.logger = new WinstonLogger();
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
    this.app.use(morgan(config.APP.LOG_LEVEL));
  }

  //Load routes
  private loadRoutes() {
    this.app.use(routes);
    this.app.use(handleErrors);
  }

  public startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      sequelizeConnection()
        .then(message => {
          this.server = this.app.listen(config.APP.PORT, () => {
            const { port, address } = this.server?.address() as AddressInfo;
            this.logger.info(`Server running on port ${address}:${port}`);
            this.logger.info(message as string);
            resolve();
          });
        })
        .catch(error => {
          this.logger.error(error);
          reject(error);
        });
    });
  }

  public stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server?.close(async error => {
        if (error) {
          this.logger.error(error);
          reject(error);
        }
        await sequelize.close();
        this.logger.info('Server closed');
        resolve();
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
