import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class SlotModel extends Model {}

SlotModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.UUID,
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
    type_vehicle: {
      type: DataTypes.ENUM('CARRO', 'MOTO', 'CAMION'),
      defaultValue: 'CARRO'
    },
    type_cost: {
      type: DataTypes.ENUM('SIN_COSTO', 'DESCUENTO', 'COMPLEMENTO'),
      defaultValue: 'SIN_COSTO'
    },
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO'
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
