import { LocationRepository } from '../../src/location/core/repositories/location-repository';

export const mockLocationRepository: jest.Mocked<LocationRepository> = {
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  getLocationById: jest.fn(),
  getLocations: jest.fn().mockReturnValue([]),
  getSlotById: jest.fn().mockReturnValue({})
};
