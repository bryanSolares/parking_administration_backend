import { MySQLSequelizeUserRepository } from '@src/auth/infrastructure/repositories/user-repository';
import { UserController } from '@src/auth/infrastructure/controller/user.controller';
import { CreateUser } from '@src/auth/application/use-cases/create-user';
import { UpdateUser } from '@src/auth/application/use-cases/update-user';
import { DeleteUser } from '@src/auth/application/use-cases/delete-user';
import { FinderById } from '@src/auth/application/use-cases/finder-by-id-user';
import { FinderUser } from '@src/auth/application/use-cases/finder-user';

export const userRepository = new MySQLSequelizeUserRepository();

const createUser = new CreateUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const finderById = new FinderById(userRepository);
const finderUser = new FinderUser(userRepository);

const userController = new UserController(
  createUser,
  updateUser,
  deleteUser,
  finderById,
  finderUser
);

export { userController };
