import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/database/sequelize';
import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';

export class AssignmentModel extends Model {}

const assignmentStatus = ['ASIGNADO', 'EN_PROGRESO', 'CANCELADO', 'RECHAZADO', 'ACEPTADO', 'BAJA_AUTOMATICA', 'BAJA_MANUAL'];

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
    parkingCardNumber: {
      type: DataTypes.STRING
    },
    benefitType: {
      type: DataTypes.ENUM,
      values: ['SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO'],
      allowNull: false
    },
    assignmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    formDecisionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: assignmentStatus,
      defaultValue: AssignmentStatus.ASSIGNED
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
