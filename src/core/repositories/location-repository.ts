import { Location } from '@core/entities/location-entity';

export interface LocationRepository {
  createLocation(location: Location): Promise<void>;
  updateLocation(location: Location): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<Location | null>;
  getLocations(): Promise<Location[] | null>;
  deleteSlots(slots: string[]): Promise<void>;
}
