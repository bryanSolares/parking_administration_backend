import { Location } from '../entities/LocationEntity';

export interface ILocationRepository {
  createLocation(location: Location): Promise<void>;
  updateLocation(location: Location): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<Location>;
  getLocations(): Promise<Location[]>;
}
