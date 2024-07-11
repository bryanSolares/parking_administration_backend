import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class LocationModel extends Model {}

LocationModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_reference: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    comments: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    longitude: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    modelName: 'location',
    tableName: 'location',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
