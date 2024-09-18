import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';
import {
  BenefitType,
  SlotStatus,
  SlotType
} from '@src/location/core/entities/slot-entity';
import { VehicleType } from '../../../../location/core/entities/slot-entity';

export class SlotModel extends Model {}

const slotType = [SlotType.SIMPLE, SlotType.MULTIPLE];
const vehicleType = [VehicleType.CAR, VehicleType.CYCLE, VehicleType.TRUCK];
const benefitType = [
  BenefitType.NO_COST,
  BenefitType.COMPLEMENT,
  BenefitType.DISCOUNT
];
const statusSlot = [
  SlotStatus.ACTIVE,
  SlotStatus.INACTIVE,
  SlotStatus.OCCUPIED
];

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
      type: DataTypes.STRING(25),
      allowNull: false
    },
    slotType: {
      type: DataTypes.ENUM,
      values: slotType,
      allowNull: false
    },
    limitOfAssignments: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    vehicleType: {
      type: DataTypes.ENUM,
      values: vehicleType,
      allowNull: false
    },
    benefitType: {
      type: DataTypes.ENUM,
      values: benefitType,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT(5, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: statusSlot,
      allowNull: false
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
