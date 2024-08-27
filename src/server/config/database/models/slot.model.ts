import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class SlotModel extends Model {}

SlotModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'location',
        key: 'id'
      }
    },
    slotNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slotType: {
      type: DataTypes.ENUM('SIMPLE', 'MULTIPLE'),
      defaultValue: 'SIMPLE'
    },
    limitOfAssignments: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    vehicleType: {
      type: DataTypes.ENUM('CARRO', 'MOTO', 'CAMION'),
      defaultValue: 'CARRO'
    },
    costType: {
      type: DataTypes.ENUM('SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO'),
      defaultValue: 'SIN_COSTO'
    },
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('DISPONIBLE', 'OCUPADO', 'INACTIVO'),
      defaultValue: 'DISPONIBLE'
    }
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'slot',
    tableName: 'slot',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    underscored: true
  }
);
