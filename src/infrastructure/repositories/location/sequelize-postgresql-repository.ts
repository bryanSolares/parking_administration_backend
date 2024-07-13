import { ForeignKeyConstraintError } from 'sequelize';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@src/server/config/database/models/location.model';
import { SlotModel } from '@src/server/config/database/models/slot.model';

import { LocationRepository } from '@core/repositories/location-repository';

import { LocationEntity } from '@core/entities/location-entity';

export class SequelizeLocationRepository implements LocationRepository {
  private readonly fieldsToLocationAllowedToCreateOrUpdate = [
    'name',
    'address',
    'contact_reference',
    'phone',
    'email',
    'comments',
    'status'
  ];

  private readonly fieldsToSlotToCreateOrUpdate = [
    'id',
    'location_id',
    'slot_number',
    'slot_type',
    'limit_schedules',
    'type_vehicle',
    'type_cost',
    'cost',
    'status'
  ];

  async createLocation(location: LocationEntity): Promise<void> {
    const transaction = await sequelize.transaction();

    // guardar location
    const locationId = uuid();
    await LocationModel.create(
      { ...location, id: locationId },
      {
        fields: ['id', ...this.fieldsToLocationAllowedToCreateOrUpdate],
        transaction
      }
    );

    const slots = location.slots.map(slot => {
      return {
        ...slot,
        id: uuid(),
        location_id: locationId
      };
    });

    // guardar slots
    await SlotModel.bulkCreate(slots, { transaction });

    await transaction.commit();

    logger().info('Location created');
  }

  async updateLocation(location: LocationEntity): Promise<void> {
    const transaction = await sequelize.transaction();

    // Update Location
    await LocationModel.update(
      {
        ...location
      },
      {
        where: { id: location.id },
        transaction,
        fields: [...this.fieldsToLocationAllowedToCreateOrUpdate]
      }
    );

    // Upsert Slots
    const slots = location.slots.map(slot => {
      return {
        ...slot,
        id: !slot.id ? uuid() : slot.id,
        location_id: location.id
      };
    });

    await Promise.all(
      slots.map(async slot => {
        await SlotModel.upsert(
          { ...slot, location_id: location.id },
          {
            fields: [...this.fieldsToSlotToCreateOrUpdate],
            transaction
          }
        );
      })
    );

    await transaction.commit();

    logger().info('Location updated');
  }

  async deleteLocation(id: string): Promise<void> {
    try {
      await LocationModel.destroy({ where: { id } });
      logger().info('Location deleted');
    } catch (error) {
      console.log(error);
      if (error instanceof ForeignKeyConstraintError) {
        throw new Error('Dont delete location with assignment or schedule');
      }

      throw error;
    }
  }

  async deleteSlots(slots: string[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await SlotModel.destroy({
        where: { id: { [Op.in]: slots } },
        transaction
      });
      await transaction.commit();
      logger().info('Slots deleted');
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ForeignKeyConstraintError) {
        throw new Error('Dont delete location with assignment or schedule');
      }

      throw error;
    }
  }

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const location = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel,
        attributes: {
          exclude: ['updated_at', 'created_at', 'latitude', 'longitude']
        }
      }
    });

    return location as unknown as LocationEntity;
  }

  async getLocations(): Promise<LocationEntity[] | null> {
    const locations = await LocationModel.findAll({
      include: [
        {
          model: SlotModel,
          attributes: { exclude: ['updated_at', 'created_at'] }
        }
      ],
      attributes: {
        exclude: ['updated_at', 'created_at', 'latitude', 'longitude']
      }
    });

    return locations as unknown as LocationEntity[];
  }
}
