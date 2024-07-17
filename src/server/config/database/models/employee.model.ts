import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class EmployeeModel extends Model {}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    code_employee: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    workplace: {
      type: DataTypes.STRING
    },
    identifier_document: {
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    sub_management: {
      type: DataTypes.STRING
    },
    management_1: {
      type: DataTypes.STRING
    },
    management_2: {
      type: DataTypes.STRING
    },
    work_site: {
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
    access_token: {
      type: DataTypes.STRING
    },
    access_token_status: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'INACTIVO'
    }
  },
  {
    sequelize,
    modelName: 'employee',
    tableName: 'employee',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
