import { LocationEntity } from '@core/entities/location-entity';
import { SlotEntity } from '@core/entities/slot-entity';

export type LocationFinderResult = Promise<{
  pageCounter: number;
  data: LocationEntity[];
}>;

export interface LocationRepository {
  createLocation(location: LocationEntity): Promise<void>;
  updateLocation(location: LocationEntity): Promise<void>;
  deleteLocation(id: string): Promise<void>;
  getLocationById(id: string): Promise<LocationEntity | null>;
  getLocations(
    limit: number,
    page: number
  ): Promise<LocationFinderResult | null>;
  deleteSlots(slots: string[]): Promise<void>;
  getSlotById(id: string): Promise<SlotEntity | null>;
}
