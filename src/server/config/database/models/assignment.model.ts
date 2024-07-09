import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AssignmentModel extends Model {}

AssignmentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    slot_id: {
      type: DataTypes.UUID
    },
    employee_id: {
      type: DataTypes.UUID
    },
    assignment_date: {
      type: DataTypes.DATE
    },
    schedule_id: {
      type: DataTypes.UUID,
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
