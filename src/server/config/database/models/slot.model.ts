import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class SlotModel extends Model {}

SlotModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    location_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'location',
        key: 'id'
      }
    },
    slot_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slot_type: {
      type: DataTypes.ENUM('SIMPLE', 'MULTIPLE'),
      defaultValue: 'SIMPLE'
    },
    limit_schedules: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    vehicle_type: {
      type: DataTypes.ENUM('CARRO', 'MOTO', 'CAMION'),
      defaultValue: 'CARRO'
    },
    cost_type: {
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
    modelName: 'slot',
    tableName: 'slot',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);
