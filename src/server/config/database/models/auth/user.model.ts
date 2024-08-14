import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    role_id: {
      type: DataTypes.STRING,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
