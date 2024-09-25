import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@server/config/database/sequelize';

export class TemplateVariableModel extends Model {}

TemplateVariableModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    variableName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    variableDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    exampleValue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'template_variable',
    tableName: 'template_variable',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
