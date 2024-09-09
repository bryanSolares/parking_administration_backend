import { Sequelize } from 'sequelize';
import { logger } from '../logger/load-logger';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: isTestEnvironment ? 'localhost' : process.env.DB_HOST,
  username: isTestEnvironment ? 'administrator' : process.env.DB_USER,
  password: isTestEnvironment ? 'administrator' : process.env.DB_PASSWORD,
  database: isTestEnvironment ? 'parking_testing' : process.env.DB_NAME,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

export const syncDatabase = () => {
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

export const sequelizeConnection = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        resolve('Connection has been established successfully.');
        if (isTestEnvironment || process.env.NODE_ENV === 'development') {
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
