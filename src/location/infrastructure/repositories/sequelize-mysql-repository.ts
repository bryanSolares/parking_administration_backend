import { Op, QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@config/database/models/location.model';
import { SlotModel } from '@config/database/models/slot.model';

import { LocationRepository } from '@location-module-core/repositories/location-repository';
import { LocationFinderResult } from '@location-module-core/repositories/location-repository';

import { LocationEntity } from '@location-module-core/entities/location-entity';
import { SlotEntity } from '@location-module-core/entities/slot-entity';

export class SequelizeMYSQLLocationRepository implements LocationRepository {
  async createLocation(location: LocationEntity): Promise<void> {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();

      const locationId = uuid();
      await LocationModel.create(
        {
          ...location,
          id: locationId
        },
        { transaction }
      );

      if (location.slots) {
        await SlotModel.bulkCreate(
          location.slots.map(slot => ({ ...slot, id: uuid(), locationId })),
          { transaction }
        );
      }

      await transaction.commit();
      logger().info('Location created');
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async updateLocation(
    location: LocationEntity,
    slotsToDelete: Set<string>
  ): Promise<void> {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();
      // Update Location
      await LocationModel.update(location, {
        where: { id: location.id },
        transaction,
        fields: [
          'name',
          'address',
          'contactReference',
          'phone',
          'email',
          'comments',
          'numberOfIdentifier',
          'status'
        ]
      });

      // Upsert Slots
      await Promise.all(
        location.slots.map(async slot => {
          await SlotModel.upsert(
            {
              ...slot,
              id: !slot.id ? uuid() : slot.id,
              locationId: location.id
            },
            {
              fields: [
                'id',
                'locationId',
                'slotNumber',
                'slotType',
                'limitOfAssignments',
                'vehicleType',
                'costType',
                'cost',
                'status'
              ],
              transaction
            }
          );
        })
      );

      if (slotsToDelete.size > 0) {
        try {
          await SlotModel.destroy({
            where: {
              id: { [Op.in]: Array.from(slotsToDelete.values()) },
              location_id: location.id
            },
            transaction
          });
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      }

      await transaction.commit();
      logger().info('Location updated');
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<void> {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();
      await LocationModel.destroy({ where: { id } });
      await SlotModel.destroy({ where: { locationId: id }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const locationDatabase = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel
      }
    });

    if (!locationDatabase) return null;

    return LocationEntity.fromPrimitives({
      ...locationDatabase.get({ plain: true })
    });
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

    const locations = locationsDatabase.map(location =>
      LocationEntity.fromPrimitives(location.get({ plain: true }))
    );

    return { data: locations, pageCounter: allPages };
  }

  async getSlotById(id: string): Promise<SlotEntity | null> {
    const slotDatabase = await SlotModel.findByPk(id);

    if (!slotDatabase) return null;

    return SlotEntity.fromPrimitives(slotDatabase.get({ plain: true }));
    //return slotDatabase?.get({ plain: true }) as SlotEntity;
  }

  async executeFunction<TypeFunctionResult = boolean | number>(
    functionName: 'location_has_active_assignment',
    params: string[]
  ): Promise<TypeFunctionResult> {
    const [resultFunction]: {
      [key: string]: boolean;
    }[] = await sequelize.query(`select ${functionName}(?)`, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    return Object.values(resultFunction)[0] as TypeFunctionResult;
  }

  async callProcedure<TypeProcedureResult>(
    procedureName: string,
    params: string[]
  ): Promise<TypeProcedureResult> {
    const [result] = await sequelize.query(`call ${procedureName}(?)`, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    return Object.values(result) as TypeProcedureResult;
  }
}
