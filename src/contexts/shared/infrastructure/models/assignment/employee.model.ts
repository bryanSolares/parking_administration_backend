import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class EmployeeModel extends Model {}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    employeeCode: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(75)
    },
    workplace: {
      type: DataTypes.STRING(100)
    },
    identifierDocument: {
      type: DataTypes.STRING(20)
    },
    company: {
      type: DataTypes.STRING(100)
    },
    department: {
      type: DataTypes.STRING(100)
    },
    subManagement: {
      type: DataTypes.STRING(100)
    },
    management1: {
      type: DataTypes.STRING(100)
    },
    management2: {
      type: DataTypes.STRING(100)
    },
    workSite: {
      type: DataTypes.STRING(100)
    },
    address: {
      type: DataTypes.STRING(100)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    phone: {
      type: DataTypes.STRING(15)
    },
    accessToken: {
      type: DataTypes.STRING(100)
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
