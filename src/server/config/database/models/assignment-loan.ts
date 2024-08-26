import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AssignmentLoanModel extends Model {}

AssignmentLoanModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    start_date_assignment: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date_assignment: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    assignment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'assignment_loan',
    modelName: 'assignment_loan',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
