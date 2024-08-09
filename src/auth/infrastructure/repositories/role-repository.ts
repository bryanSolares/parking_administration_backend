import { v4 as uuid } from 'uuid';
import { RoleEntity } from '@src/auth/domain/entities/role-entity';
import { RoleRepository } from '@src/auth/domain/repository/role-repository';

import { RoleModel } from '@config/database/models/auth/role.model';

export class MySQLSequelizeRoleRepository implements RoleRepository {
  async create(data: {
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void> {
    const roleEntity = RoleEntity.fromPrimitives({ ...data, id: uuid() });
    await RoleModel.create(
      { ...roleEntity },
      { fields: ['id', 'name', 'description', 'status'] }
    );
  }

  async update(data: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void> {
    const roleEntity = RoleEntity.fromPrimitives(data);
    await RoleModel.update(
      { ...roleEntity },
      {
        where: { id: data.id },
        fields: ['name', 'description', 'status']
      }
    );
  }

  async delete(id: string): Promise<void> {
    await RoleModel.destroy({ where: { id } });
  }

  async getById(id: string): Promise<RoleEntity | null> {
    const roleDatabase = await RoleModel.findOne({
      where: { id }
    });
    return roleDatabase
      ? RoleEntity.fromPrimitives(roleDatabase?.get({ plain: true }))
      : null;
  }

  async getAll(
    limit: number = 20,
    page: number = 1
  ): Promise<{ data: RoleEntity[]; pageCounter: number }> {
    const roleCounter = await RoleModel.count();
    const allPages = Math.ceil(roleCounter / limit);
    const offset = (page - 1) * limit;

    const rolesDatabase = await RoleModel.findAll({ offset, limit });

    const roles = rolesDatabase.map(role =>
      RoleEntity.fromPrimitives(role.get({ plain: true }))
    );

    return {
      data: roles,
      pageCounter: allPages
    };
  }
}
