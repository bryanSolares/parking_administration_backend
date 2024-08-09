import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class RoleModel extends Model {}

RoleModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'role',
    tableName: 'role',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
