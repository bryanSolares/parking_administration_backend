import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

export class ScheduleModel extends Model {}

ScheduleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    slot_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    start_time_assignment: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time_assignment: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      allowNull: false,
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    modelName: 'schedule',
    tableName: 'schedule',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
