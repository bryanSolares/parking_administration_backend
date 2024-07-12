import { sequelize } from '@config/database/sequelize';
import { DataTypes, Model } from 'sequelize';

export class VehicleModel extends Model {}

VehicleModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicle_badge: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING
    },
    brand: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      values: ['CARRO', 'MOTO', 'CAMION'],
      defaultValue: 'CARRO'
    }
  },
  {
    sequelize,
    modelName: 'vehicle',
    tableName: 'vehicle',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
