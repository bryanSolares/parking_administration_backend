import { LocationEntity } from '@core/entities/location-entity';

export interface LocationRepository {
  createLocation(location: LocationEntity): Promise<void>;
  updateLocation(location: LocationEntity): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<LocationEntity | null>;
  getLocations(): Promise<LocationEntity[] | null>;
  deleteSlots(slots: string[]): Promise<void>;
}
