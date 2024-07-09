import { logger } from '../../../infrastructure/config/logger/load-logger';

import { LocationModel } from '../database/models/Location';
import { Location } from '../../core/entities/LocationEntity';

import { ILocationRepository } from '../../core/repositories/ILocationRepository';

export class SequelizeLocationRepository implements ILocationRepository {
  async createLocation(location: Location): Promise<void> {
    const newLocation = this.transformLocation(location);
    await LocationModel.create({ ...newLocation });
    logger().info('Location created');
  }

  async updateLocation(location: Location): Promise<void> {
    const newLocation = this.transformLocation(location);
    await LocationModel.update(newLocation, { where: { id: location.id } });
    logger().info('Location updated');
  }

  async deleteLocation(id: string): Promise<void> {
    await LocationModel.destroy({ where: { id } });
    logger().info('Location deleted');
  }

  async getLocationById(id: string): Promise<Location> {
    const locationDatabase = await LocationModel.findOne({ where: { id } });

    const location = new Location(
      locationDatabase?.getDataValue('id') as string,
      locationDatabase?.getDataValue('name') as string,
      locationDatabase?.getDataValue('address') as string,
      locationDatabase?.getDataValue('contact_reference') as string,
      locationDatabase?.getDataValue('phone') as string,
      locationDatabase?.getDataValue('email') as string,
      locationDatabase?.getDataValue('comments') as string,
      locationDatabase?.getDataValue('latitude') as number,
      locationDatabase?.getDataValue('longitude') as number,
      locationDatabase?.getDataValue('status') as string,
      locationDatabase?.getDataValue('created_at') as Date,
      locationDatabase?.getDataValue('updated_at') as Date
    );

    return location;
  }

  async getLocations(): Promise<Location[]> {
    const Locations = await LocationModel.findAll();
    const locations = Locations.map(location => {
      return new Location(
        location?.getDataValue('id') as string,
        location?.getDataValue('name') as string,
        location?.getDataValue('address') as string,
        location?.getDataValue('contact_reference') as string,
        location?.getDataValue('phone') as string,
        location?.getDataValue('email') as string,
        location?.getDataValue('comments') as string,
        location?.getDataValue('latitude') as number,
        location?.getDataValue('longitude') as number,
        location?.getDataValue('status') as string,
        location?.getDataValue('created_at') as Date,
        location?.getDataValue('updated_at') as Date
      );
    });

    return locations;
  }

  private transformLocation(location: Location): Location {
    return new Location(
      location.id,
      location.name,
      location.address,
      location.contact_reference,
      location.phone,
      location.email,
      location.comments,
      location.latitude,
      location.longitude,
      location.status,
      location.created_at,
      location.updated_at
    );
  }
}
