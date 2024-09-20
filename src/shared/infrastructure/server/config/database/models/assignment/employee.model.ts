import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class EmployeeModel extends Model {}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    },
    workplace: {
      type: DataTypes.STRING
    },
    identifierDocument: {
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    subManagement: {
      type: DataTypes.STRING
    },
    management1: {
      type: DataTypes.STRING
    },
    management2: {
      type: DataTypes.STRING
    },
    workSite: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    accessToken: {
      type: DataTypes.STRING
    },
    accessTokenStatus: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'INACTIVO'
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'employee',
    tableName: 'employee',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
