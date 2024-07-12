import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AssignmentModel extends Model {}

AssignmentModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    slot_id: {
      type: DataTypes.STRING
    },
    employee_id: {
      type: DataTypes.STRING
    },
    assignment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    schedule_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    modelName: 'assignment',
    tableName: 'assignment',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
