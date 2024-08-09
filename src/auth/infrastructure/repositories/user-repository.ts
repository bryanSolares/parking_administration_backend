import { v4 as uuid } from 'uuid';
import { UserEntity } from '@src/auth/domain/entities/user-entity';
import { UserRepository } from '@src/auth/domain/repository/user-repository';

import { UserModel } from '@config/database/models/auth/user.model';

export class MySQLSequelizeUserRepository implements UserRepository {
  async create(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
  }): Promise<void> {
    const userEntity = UserEntity.fromPrimitives({ ...user, id: uuid() });
    await UserModel.create({ ...userEntity });
  }

  async update(user: {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
  }): Promise<void> {
    const userEntity = UserEntity.fromPrimitives(user);
    await UserModel.update(
      { ...userEntity },
      {
        where: { id: user.id },
        fields: ['name', 'email', 'username', 'password', 'status', 'phone']
      }
    );
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async getById(id: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      }
    });
    return userDatabase
      ? UserEntity.fromPrimitives(userDatabase?.get({ plain: true }))
      : null;
  }

  async getAll(
    limit: number = 20,
    page: number = 1
  ): Promise<{ data: UserEntity[]; pageCounter: number }> {
    const usersCounter = await UserModel.count();
    const allPages = Math.ceil(usersCounter / limit);
    const offset = (page - 1) * limit;

    const usersDatabase = await UserModel.findAll({ offset, limit });

    const users = usersDatabase.map(user =>
      UserEntity.fromPrimitives(user.get({ plain: true }))
    );

    return {
      data: users,
      pageCounter: allPages
    };
  }
}
