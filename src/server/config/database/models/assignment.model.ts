import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AssignmentModel extends Model {}

const assignmentStatus = [
  'CREADO',
  'EN_PROGRESO',
  'CANCELADO',
  'ACTIVO',
  'BAJA_AUTOMATICA',
  'BAJA_MANUAL'
];

AssignmentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'slot',
        key: 'id'
      }
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    assignmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    decisionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: assignmentStatus,
      defaultValue: 'CREADO'
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'assignment',
    tableName: 'assignment',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);
