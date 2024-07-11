import { CreateLocation } from '../../application/location/create-location';
import { UpdateLocation } from '../../application/location/update-location';
import { DeleteLocation } from '../../application/location/delete-location';
import { GetLocationByIdFinder } from '../../application/location/location-by-id-finder';
import { LocationFinder } from '../../application/location/location-finder';

import { LocationNotFoundError } from '../../core/exceptions/location-not-found';

import { LocationRepository } from '../../core/repositories/location-repository';

import { LocationEntity } from '../../core/entities/location-entity';

const mockLocationRepository: jest.Mocked<LocationRepository> = {
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  getLocationById: jest.fn(),
  getLocations: jest.fn().mockReturnValue([]),
  deleteSlots: jest.fn()
};

describe('Location Use Cases', () => {
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

  it('should find a location by id', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);
    const findById = new GetLocationByIdFinder(mockLocationRepository);
    const foundLocation = await findById.run('1');
    expect(foundLocation).toEqual(location);
    expect(mockLocationRepository.getLocationById).toHaveBeenCalledWith('1');
  });

  it('should throw an error if location not found', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    const findById = new GetLocationByIdFinder(mockLocationRepository);
    await expect(findById.run('1')).rejects.toThrow(LocationNotFoundError);
  });

  it('should find all locations', async () => {
    const getAllLocations = new LocationFinder(mockLocationRepository);
    await getAllLocations.run();
    expect(mockLocationRepository.getLocations).toHaveBeenCalled();
  });

  it('should update a location', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);
    const updateLocation = new UpdateLocation(mockLocationRepository);
    await updateLocation.run(location);
    expect(mockLocationRepository.updateLocation).toHaveBeenCalledWith(
      location
    );
  });

  it('should throw an error if location not found to update', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    const updateLocation = new UpdateLocation(mockLocationRepository);
    await expect(updateLocation.run(location)).rejects.toThrow(
      LocationNotFoundError
    );
  });

  it('should delete a location', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(location);
    const deleteLocation = new DeleteLocation(mockLocationRepository);
    await deleteLocation.run('1');
    expect(mockLocationRepository.deleteLocation).toHaveBeenCalledWith('1');
  });

  it('should throw an error if location not found to delete', async () => {
    mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
    const findById = new DeleteLocation(mockLocationRepository);
    await expect(findById.run('1')).rejects.toThrow(LocationNotFoundError);
  });
});
