import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';

export class NotificationQueueModel extends Model {}

const eventTypes = [
  'ACCEPTANCE_FORM',
  'ACCEPTANCE_ASSIGNMENT',
  'MANUAL_DE_ASSIGNMENT',
  'AUTO_DE_ASSIGNMENT',
  'DISCOUNT_NOTE',
  'ASSIGNMENT_LOAN',
  'DE_ASSIGNMENT_LOAN'
];
const eventStatus = ['PENDING', 'IN_PROGRESS', 'DISPATCHED', 'FAILED', 'RETRYING'];

NotificationQueueModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    eventType: {
      type: DataTypes.ENUM,
      values: eventTypes,
      allowNull: false
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: eventStatus,
      allowNull: false
    },
    attempts: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    maxRetries: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 3
    },
    dispatchedAt: {
      type: DataTypes.DATE
    },
    errorMessage: {
      type: DataTypes.TEXT
    },
    nextAttempt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    underscored: true,
    version: true,
    modelName: 'notification_queue',
    tableName: 'notification_queue',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
