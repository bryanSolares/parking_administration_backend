import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class DeAssignmentModel extends Model {}

DeAssignmentModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    assignment_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    de_assignment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_rpa_action: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'de_assignment',
    tableName: 'de_assignment',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
