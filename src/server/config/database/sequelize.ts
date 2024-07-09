import { Sequelize } from 'sequelize';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const sequelize = new Sequelize({
  dialect: isTestEnvironment ? 'sqlite' : 'postgres',
  host: isTestEnvironment ? undefined : process.env.DB_HOST,
  username: isTestEnvironment ? undefined : process.env.DB_USER,
  password: isTestEnvironment ? undefined : process.env.DB_PASSWORD,
  database: isTestEnvironment ? undefined : process.env.DB_NAME,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: true
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
      })
      .catch(err => {
        reject(err);
      });
  });
};
