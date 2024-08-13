import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class RoleDetailModel extends Model {}

RoleDetailModel.init(
  {
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    resource_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'resource',
        key: 'id'
      }
    },
    can_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'role_detail',
    tableName: 'role_detail',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
