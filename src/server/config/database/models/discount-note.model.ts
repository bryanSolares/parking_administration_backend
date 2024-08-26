import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

import { sequelize } from '../sequelize';

export class DiscountNoteModel extends Model {}

DiscountNoteModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status_signature: {
      type: DataTypes.ENUM,
      values: ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO'],
      defaultValue: 'PENDIENTE'
    },
    status_dispatched: {
      type: DataTypes.ENUM,
      values: ['EXITOSO', 'FALLIDO', 'PENDIENTE', 'REINTENTANDO'],
      defaultValue: 'PENDIENTE'
    },
    last_notice: {
      type: DataTypes.DATE
    },
    next_notice: {
      type: DataTypes.DATE
    },
    reminder_frequency: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    dispatch_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_dispatch_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    }
  },
  {
    sequelize,
    modelName: 'discount_note',
    tableName: 'discount_note',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
