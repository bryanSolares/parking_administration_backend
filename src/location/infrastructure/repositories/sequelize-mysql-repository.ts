/* eslint-disable  @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable  @typescript-eslint/no-unused-vars */

import { Op, QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { logger } from '@config/logger/load-logger';
import { sequelize } from '@config/database/sequelize';

import { LocationModel } from '@config/database/models/location.model';
import { SlotModel } from '@config/database/models/slot.model';

import {
  LocationRepository,
  OverviewDataResult,
  TrendDataResult
} from '@location-module-core/repositories/location-repository';
import { LocationFinderResult } from '@location-module-core/repositories/location-repository';

import { LocationEntity } from '@location-module-core/entities/location-entity';
import {
  SlotEntity,
  SlotStatus
} from '@location-module-core/entities/slot-entity';
import { ParkingTrendsModel } from '@src/server/config/database/models/parking/parking-trends';

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
      include: [
        {
          model: SlotModel,
          as: 'slots',
          attributes: ['status']
        }
      ],
      limit,
      offset
    });

    let locationTmp;
    const locations = locationsDatabase.map((location: LocationModel) => {
      locationTmp = location.get({ plain: true });
      const slots = locationTmp.slots || [];

      const totalSlots = slots.length;
      let availableSlots: number = 0;
      let unavailableSlots: number = 0;
      let occupiedSlots: number = 0;

      slots.forEach((slot: { status: string }) => {
        if (slot.status === SlotStatus.ACTIVE) {
          availableSlots++;
        }

        if (slot.status === SlotStatus.INACTIVE) {
          unavailableSlots++;
        }

        if (slot.status === SlotStatus.OCCUPIED) {
          occupiedSlots++;
        }
      });

      return {
        id: locationTmp.id,
        name: locationTmp.name,
        address: locationTmp.address,
        contactReference: locationTmp.contactReference,
        phone: locationTmp.phone,
        email: locationTmp.email,
        comments: locationTmp.comments,
        numberOfIdentifier: locationTmp.numberOfIdentifier,
        status: locationTmp.status,
        totalSlots,
        availableSlots,
        unavailableSlots,
        occupiedSlots
      };
    });

    return { data: locations, pageCounter: allPages };
  }

  async getSlotById(id: string): Promise<SlotEntity | null> {
    const slotDatabase = await SlotModel.findByPk(id);
    return slotDatabase?.get({ plain: true }) as SlotEntity;
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

  async overviewData(): Promise<OverviewDataResult> {
    const [result]: {
      total_slots: number;
      available_slots: number;
      unavailable_slots: number;
      occupied_slots: number;
    }[] = await sequelize.query(
      `
      select
      sum(total_slots) as total_slots,
      sum(available_slots) as available_slots,
      sum(unavailable_slots) as unavailable_slots,
      sum(occupied_slots) as occupied_slots
      from location_slot_summary
      `,
      {
        type: QueryTypes.SELECT
      }
    );

    return {
      totalSlots: Number(result.total_slots),
      availableSlots: Number(result.available_slots),
      unavailableSlots: Number(result.unavailable_slots),
      occupiedSlots: Number(result.occupied_slots)
    };
  }
  async trendData(
    limit: number = 20,
    page: number = 1,
    startDate: string,
    endDate: string
  ): Promise<TrendDataResult[]> {
    const trendsCounter = await ParkingTrendsModel.count({
      where: { date: { [Op.between]: [startDate, endDate] } }
    });
    const allPages = Math.ceil(trendsCounter / limit);
    const offset = (page - 1) * limit;

    const data = await ParkingTrendsModel.findAll({
      where: { date: { [Op.between]: [startDate, endDate] } },
      limit,
      offset
    });

    return data.map((item: ParkingTrendsModel) => {
      const data = item.get({ plain: true });
      return {
        date: data.date,
        totalSlots: data.totalSlots,
        availableSlots: data.availableSlots,
        unavailableSlots: data.unavailableSlots,
        occupiedSlots: data.occupiedSlots,
        occupancyRate: data.occupancyRate
      };
    });
  }
}
