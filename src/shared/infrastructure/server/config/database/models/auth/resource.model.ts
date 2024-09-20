import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class ResourceModel extends Model {}

ResourceModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'resource',
    tableName: 'resource',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
