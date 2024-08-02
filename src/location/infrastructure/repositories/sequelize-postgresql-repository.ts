import { ForeignKeyConstraintError } from 'sequelize';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@config/database/models/location.model';
import { SlotModel } from '@config/database/models/slot.model';

import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationFinderResult } from '@location-module-core/repositories/location-repository';

import { LocationEntity } from '@location-module-core/entities/location-entity';
import { SlotEntity } from '@location-module-core/entities/slot-entity';

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

  private readonly fieldsExcluded = ['updated_at', 'created_at'];

  async createLocation(location: LocationEntity): Promise<void> {
    const transaction = await sequelize.transaction();

    const locationId = uuid();
    await LocationModel.create(
      { ...location, id: locationId },
      {
        fields: ['id', ...this.fieldsToLocationAllowedToCreateOrUpdate],
        transaction
      }
    );

    if (location.slots) {
      const slots = location.slots.map(slot => {
        return {
          ...slot,
          id: uuid(),
          location_id: locationId
        };
      });

      await SlotModel.bulkCreate(slots, { transaction });
    }

    await transaction.commit();

    logger().info('Location created');
  }

  async updateLocation(
    location: LocationEntity,
    slotsToDelete: string[]
  ): Promise<void> {
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
    await Promise.all(
      location.slots.map(async slot => {
        await SlotModel.upsert(
          {
            ...slot,
            id: !slot.id ? uuid() : slot.id,
            location_id: location.id
          },
          {
            fields: [...this.fieldsToSlotToCreateOrUpdate],
            transaction
          }
        );
      })
    );

    if (slotsToDelete.length > 0) {
      try {
        await SlotModel.destroy({
          where: { id: { [Op.in]: slotsToDelete }, location_id: location.id },
          transaction
        });
      } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
          throw new Error(
            'You can not delete slots with assignment or schedule'
          );
        }
        throw error;
      }
    }

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

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const location = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel,
        attributes: {
          exclude: [...this.fieldsExcluded]
        }
      },
      attributes: {
        exclude: [...this.fieldsExcluded, 'latitude', 'longitude']
      }
    });

    return location?.get({ plain: true }) as LocationEntity;
  }

  async getLocations(
    limit: number = 20,
    page: number = 1
  ): Promise<LocationFinderResult | null> {
    const locationsCounter = await LocationModel.count();
    const allPages = Math.ceil(locationsCounter / limit);
    const offset = (page - 1) * limit;

    const locationsDatabase = await LocationModel.findAll({
      attributes: {
        exclude: ['updated_at', 'latitude', 'longitude']
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const locationsData = locationsDatabase.map(location =>
      LocationEntity.fromPrimitives(location.get({ plain: true }))
    );

    return { data: locationsData, pageCounter: allPages };
  }

  async getSlotById(id: string): Promise<SlotEntity | null> {
    const slotDatabase = await SlotModel.findByPk(id);
    return slotDatabase?.get({ plain: true }) as SlotEntity;
  }
}
