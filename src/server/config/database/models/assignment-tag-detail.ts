import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database/sequelize';

export class AssignmentTagDetailModel extends Model {}

AssignmentTagDetailModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    assignment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'assignment_tag_detail',
    modelName: 'assignment_tag_detail',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
