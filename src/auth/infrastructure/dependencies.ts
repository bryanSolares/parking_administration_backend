import { MySQLSequelizeUserRepository } from '@src/auth/infrastructure/repositories/user-repository';
import { MySQLSequelizeRoleRepository } from '@src/auth/infrastructure/repositories/role-repository';

import { UserController } from '@src/auth/infrastructure/controller/user.controller';
import { RoleController } from '@src/auth/infrastructure/controller/role.controller';

import { CreateUser } from '@src/auth/application/use-cases/create-user';
import { UpdateUser } from '@src/auth/application/use-cases/update-user';
import { DeleteUser } from '@src/auth/application/use-cases/delete-user';
import { FinderById as FinderByIdUser } from '@src/auth/application/use-cases/finder-by-id-user';
import { FinderUser } from '@src/auth/application/use-cases/finder-user';

import { CreateRole } from '@src/auth/application/use-cases/role/create-role';
import { UpdateRole } from '@src/auth/application/use-cases/role/update-role';
import { DeleteRole } from '@src/auth/application/use-cases/role/delete-role';
import { FinderById as FinderByIdRole } from '@src/auth/application/use-cases/role/finder-by-id-role';
import { FinderRole } from '@src/auth/application/use-cases/role/finder-role';
import { FinderResource } from '@src/auth/application/use-cases/role/finder-resource';

export const userRepository = new MySQLSequelizeUserRepository();
export const roleRepository = new MySQLSequelizeRoleRepository();

const createUser = new CreateUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const finderById = new FinderByIdUser(userRepository);
const finderUser = new FinderUser(userRepository);

const createRole = new CreateRole(roleRepository);
const updateRole = new UpdateRole(roleRepository);
const deleteRole = new DeleteRole(roleRepository);
const finderByIdRole = new FinderByIdRole(roleRepository);
const finderRole = new FinderRole(roleRepository);
const finderResources = new FinderResource(roleRepository);

const userController = new UserController(
  createUser,
  updateUser,
  deleteUser,
  finderById,
  finderUser
);

const roleController = new RoleController(
  createRole,
  updateRole,
  deleteRole,
  finderByIdRole,
  finderRole,
  finderResources
);

export { userController, roleController };
