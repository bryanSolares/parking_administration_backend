import { LocationEntity } from '../entities/location-entity';
import { SlotEntity } from '../entities/slot-entity';

export interface LocationFinderResultWithStatusCounterSlots {
  id: string;
  name: string;
  address: string;
  contactReference: string;
  phone: string;
  email: string;
  comments: string;
  numberOfIdentifier: string;
  status: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  unavailableSlots: number;
}

export type LocationFinderResult = Promise<{
  pageCounter: number;
  data: LocationFinderResultWithStatusCounterSlots[];
}>;

export type FunctionNames = 'location_has_active_assignment';

export type ProcedureNames = 'get_active_assignments_by_location';

export interface OverviewDataResult {
  totalSlots: number;
  availableSlots: number;
  unavailableSlots: number;
  occupiedSlots: number;
}

export interface TrendDataResult {
  date: string;
  totalSlots: number;
  availableSlots: number;
  unavailableSlots: number;
  occupiedSlots: number;
  occupancyRate: number;
}

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
  executeFunction<TypeFunctionResult = boolean | number>(
    functionName: FunctionNames,
    params: string[]
  ): Promise<TypeFunctionResult>;
  callProcedure<TypeProcedureResult>(
    procedureName: ProcedureNames,
    params: string[]
  ): Promise<TypeProcedureResult>;
  overviewData(): Promise<OverviewDataResult>;
  trendData(
    limit: number,
    page: number,
    startDate: string,
    endDate: string
  ): Promise<TrendDataResult[]>;
}
