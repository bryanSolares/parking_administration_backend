import { LocationEntity } from '../entities/location-entity';
import { SlotEntity } from '../entities/slot-entity';

export type LocationFinderResult = Promise<{
  pageCounter: number;
  data: LocationEntity[];
}>;

export type FunctionNames = 'location_has_active_assignment';

export interface LocationRepository {
  createLocation(location: LocationEntity): Promise<void>;
  updateLocation(
    location: LocationEntity,
    slotsToDelete: Set<string>
  ): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<LocationEntity | null>;
  getLocations(
    limit: number,
    page: number
  ): Promise<LocationFinderResult | null>;
  getSlotById(id: string): Promise<SlotEntity | null>;
  executeBoolFunction(
    functionName: FunctionNames,
    params: string[]
  ): Promise<boolean>;
}
