import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

import { sequelize } from '../sequelize';
import { DiscountNodeStatusSignature } from '@src/assignment/core/entities/discount-note-entity';

export class DiscountNoteModel extends Model {}

const statusSignature = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO'];

const statusDispatched = ['EXITOSO', 'FALLIDO', 'PENDIENTE', 'REINTENTANDO'];

DiscountNoteModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    statusSignature: {
      type: DataTypes.ENUM,
      values: statusSignature,
      defaultValue: DiscountNodeStatusSignature.PENDING
    },
    statusDispatched: {
      type: DataTypes.ENUM,
      values: statusDispatched,
      defaultValue: DiscountNodeStatusSignature.PENDING
    },
    lastNotice: {
      type: DataTypes.DATE
    },
    nextNotice: {
      type: DataTypes.DATE
    },
    reminderFrequency: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    dispatchAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    maxDispatchAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'discount_note',
    tableName: 'discount_note',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
