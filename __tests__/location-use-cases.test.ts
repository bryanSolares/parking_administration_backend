import { LocationRepository } from '../src/location/core/repositories/location-repository';

import { CreateLocation } from '../src/location/application/user-cases/create-location';
import { UpdateLocation } from '../src/location/application/user-cases/update-location';
import { DeleteLocation } from '../src/location/application/user-cases/delete-location';
import { GetLocationByIdFinder } from '../src/location/application/user-cases/location-by-id-finder';
import { LocationFinder } from '../src/location/application/user-cases/location-finder';

import { LocationEntity } from '../src/location/core/entities/location-entity';

export const mockLocationRepository: jest.Mocked<LocationRepository> = {
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  getLocationById: jest.fn(),
  getLocations: jest.fn().mockReturnValue([]),
  getSlotById: jest.fn().mockReturnValue({})
};

describe('LOCATION: Use Cases', () => {
  const location = new LocationEntity('1', 'Test Location', 'Test Address', []);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new location', async () => {
    const createLocation = new CreateLocation(mockLocationRepository);
    await createLocation.run(location);
    expect(mockLocationRepository.createLocation).toHaveBeenCalledWith(
      expect.any(LocationEntity)
    );
  });

  it('should update a location and throw an error if location not found', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);
    const updateLocation = new UpdateLocation(mockLocationRepository);
    await updateLocation.run(location, []);
    expect(mockLocationRepository.updateLocation).toHaveBeenCalledWith(
      location,
      []
    );

    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    await expect(updateLocation.run(location, [])).rejects.toThrow();
  });

  it('should delete a location and throw an error if location not found', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);

    const deleteLocation = new DeleteLocation(mockLocationRepository);
    await deleteLocation.run('1');

    expect(mockLocationRepository.deleteLocation).toHaveBeenCalledWith('1');

    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    await expect(deleteLocation.run('1')).rejects.toThrow();
  });

  it('should find a location by id and throw an error if location not found', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);
    const findById = new GetLocationByIdFinder(mockLocationRepository);
    await findById.run('1');
    expect(mockLocationRepository.getLocationById).toHaveBeenCalledWith('1');

    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    await expect(findById.run('1')).rejects.toThrow();
  });

  it('should find all locations', async () => {
    const getAllLocations = new LocationFinder(mockLocationRepository);
    await getAllLocations.run(1, 1);
    expect(mockLocationRepository.getLocations).toHaveBeenCalled();
  });
});
