import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class SettingModel extends Model {}

SettingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    setting_key: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    setting_value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'setting',
    tableName: 'setting',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
