import { Sequelize } from 'sequelize';
import { logger } from '../logger/load-logger';
import { config } from '../logger/load-envs';

export const sequelize = new Sequelize(`mysql://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`, {
  dialect: 'mysql',
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

const syncDatabase = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync({ force: false })
      .then(() => {
        resolve('Database synced');
      })
      .catch(err => {
        reject(err);
      });
  });
};

//TODO: Typo (startConnection)
export const sequelizeConnection = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        resolve('Connection has been established successfully.');
        if (process.env.NODE_ENV === 'development') {
          syncDatabase()
            .then(message => logger().info(message))
            .catch(error => {
              logger().error('Error syncing database', error);
              reject(error);
            });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
