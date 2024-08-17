import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@config/database/models/location.model';
import { SlotModel } from '@config/database/models/slot.model';

import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationFinderResult } from '@location-module-core/repositories/location-repository';

import { LocationEntity } from '@location-module-core/entities/location-entity';
import {
  CostType,
  SlotEntity,
  SlotStatus,
  SlotType,
  VehicleType
} from '@location-module-core/entities/slot-entity';

export class SequelizeMYSQLLocationRepository implements LocationRepository {
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

    const locationId = uuid();
    await LocationModel.create(
      {
        ...location,
        id: locationId,
        contact_reference: location.contactReference
      },
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
          location_id: locationId,
          slot_number: slot.slotNumber,
          slot_type: slot.slotType,
          limit_schedules: slot.limitSchedules,
          cost_type: slot.costType,
          vehicle_type: slot.vehicleType
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
        await transaction.rollback();
        throw error;
      }
    }

    await transaction.commit();

    logger().info('Location updated');
  }

  async deleteLocation(id: string): Promise<void> {
    await LocationModel.destroy({ where: { id } });
  }

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const locationDatabase = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel
      }
    });

    if (!locationDatabase) return null;

    return this.transformData(
      locationDatabase,
      locationDatabase.get({ plain: true }).slots
    );
  }

  async getLocations(
    limit: number = 20,
    page: number = 1
  ): Promise<LocationFinderResult | null> {
    const locationsCounter = await LocationModel.count();
    const allPages = Math.ceil(locationsCounter / limit);
    const offset = (page - 1) * limit;

    const locationsDatabase = await LocationModel.findAll({
      order: [['name', 'ASC']],
      limit,
      offset
    });

    const locations = locationsDatabase.map(location => {
      return this.transformData(location);
    });

    return { data: locations, pageCounter: allPages };
  }

  async getSlotById(id: string): Promise<SlotEntity | null> {
    const slotDatabase = await SlotModel.findByPk(id);
    return slotDatabase?.get({ plain: true }) as SlotEntity;
  }

  private transformData(
    locationModel: LocationModel,
    slots: {
      id: string;
      slot_number: string;
      slot_type: SlotType;
      limit_schedules: number;
      cost_type: CostType;
      cost: number;
      vehicle_type: VehicleType;
      status: SlotStatus;
    }[] = []
  ): LocationEntity {
    return LocationEntity.fromPrimitives({
      ...locationModel.get({ plain: true }),
      contactReference: locationModel.get('contact_reference'),
      slots: slots.map(slot =>
        SlotEntity.fromPrimitives({
          ...slot,
          slotNumber: slot.slot_number,
          slotType: slot.slot_type,
          limitSchedules: slot.limit_schedules,
          costType: slot.cost_type,
          vehicleType: slot.vehicle_type
        })
      )
    });
  }
}
