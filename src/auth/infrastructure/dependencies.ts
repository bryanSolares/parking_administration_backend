import { MySQLSequelizeUserRepository } from '@src/auth/infrastructure/repositories/user-repository';
import { MySQLSequelizeRoleRepository } from '@src/auth/infrastructure/repositories/role-repository';
import { AuthJWTRepository } from '@src/auth/infrastructure/repositories/auth-repository';

import { UserController } from '@src/auth/infrastructure/controller/user.controller';
import { RoleController } from '@src/auth/infrastructure/controller/role.controller';
import { AuthController } from '@src/auth/infrastructure/controller/auth.controller';

import { CreateUser } from '@src/auth/application/use-cases/user/create-user';
import { UpdateUser } from '@src/auth/application/use-cases/user/update-user';
import { DeleteUser } from '@src/auth/application/use-cases/user/delete-user';
import { FinderById as FinderByIdUser } from '@src/auth/application/use-cases/user/finder-by-id-user';
import { FinderUser } from '@src/auth/application/use-cases/user/finder-user';

import { LoginUseCase } from '@src/auth/application/use-cases/auth/login';
import { RefreshTokenUseCase } from '@src/auth/application/use-cases/auth/refresh-token';

import { CreateRole } from '@src/auth/application/use-cases/role/create-role';
import { UpdateRole } from '@src/auth/application/use-cases/role/update-role';
import { DeleteRole } from '@src/auth/application/use-cases/role/delete-role';
import { FinderById as FinderByIdRole } from '@src/auth/application/use-cases/role/finder-by-id-role';
import { FinderRole } from '@src/auth/application/use-cases/role/finder-role';
import { FinderResource } from '@src/auth/application/use-cases/role/finder-resource';

const userRepository = new MySQLSequelizeUserRepository();
const roleRepository = new MySQLSequelizeRoleRepository();
const authRepository = new AuthJWTRepository(roleRepository);

const createUser = new CreateUser(userRepository, roleRepository);
const updateUser = new UpdateUser(userRepository, roleRepository);
const deleteUser = new DeleteUser(userRepository);
const finderById = new FinderByIdUser(userRepository);
const finderUser = new FinderUser(userRepository);

const authUseCase = new LoginUseCase(authRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);

const createRole = new CreateRole(roleRepository);
const updateRole = new UpdateRole(roleRepository);
const deleteRole = new DeleteRole(roleRepository);
const finderByIdRole = new FinderByIdRole(roleRepository);
const finderRole = new FinderRole(roleRepository);
const finderResources = new FinderResource(roleRepository);

const userController = new UserController(createUser, updateUser, deleteUser, finderById, finderUser);

const roleController = new RoleController(createRole, updateRole, deleteRole, finderByIdRole, finderRole, finderResources);

const authController = new AuthController(authUseCase, refreshTokenUseCase);

export { userController, roleController, authController };
