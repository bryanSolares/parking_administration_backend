import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@src/server/config/database/models/location.model';
import { SlotModel } from '@src/server/config/database/models/slot.model';

import { LocationRepository } from '@core/repositories/location-repository';

import { LocationEntity } from '@core/entities/location-entity';

export class SequelizeLocationRepository implements LocationRepository {
  async createLocation(location: LocationEntity): Promise<void> {
    const transaction = await sequelize.transaction();

    // guardar location
    const newLocation = await LocationModel.create(
      { ...location, id: uuid() },
      {
        fields: [
          'id',
          'name',
          'address',
          'contact_reference',
          'phone',
          'email',
          'comments',
          'latitude',
          'longitude',
          'status'
        ],
        transaction
      }
    );
    const idLocation = newLocation.getDataValue('id');
    logger().info(idLocation);

    const slots = location.slots.map(slot => {
      return {
        ...slot,
        id: uuid(),
        location_id: idLocation
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
        fields: [
          'name',
          'address',
          'contact_reference',
          'phone',
          'email',
          'comments',
          'latitude',
          'longitude',
          'status'
        ]
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
            fields: [
              'id',
              'location_id',
              'slot_number',
              'slot_type',
              'limit_schedules',
              'type_vehicle',
              'type_cost',
              'cost',
              'status'
            ],
            transaction
          }
        );
      })
    );

    await transaction.commit();

    logger().info('Location updated');
  }

  //TODO: delete on cascade
  async deleteLocation(id: string): Promise<void> {
    await LocationModel.destroy({ where: { id } });
    logger().info('Location deleted');
  }

  async deleteSlots(slots: string[]): Promise<void> {
    const transaction = await sequelize.transaction();
    await SlotModel.destroy({ where: { id: { [Op.in]: slots } }, transaction });
    await transaction.commit();
    logger().info('Slots deleted');
  }

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const location = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel
      }
    });

    return location as unknown as LocationEntity;
  }

  async getLocations(): Promise<LocationEntity[] | null> {
    const locations = await LocationModel.findAll({ include: SlotModel });

    return locations as unknown as LocationEntity[];
  }
}
