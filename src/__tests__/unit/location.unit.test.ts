import { CreateLocation } from '../../application/location/create-location';
import { UpdateLocation } from '../../application/location/update-location';
import { DeleteLocation } from '../../application/location/delete-location';
import { GetLocationByIdFinder } from '../../application/location/location-by-id-finder';
import { LocationFinder } from '../../application/location/location-finder';

import { LocationRepository } from '../../core/repositories/location-repository';

import { Location } from '../../core/entities/location-entity';

const mockLocationRepository: jest.Mocked<LocationRepository> = {
  createLocation: jest.fn(),
  updateLocation: jest.fn(),
  deleteLocation: jest.fn(),
  getLocationById: jest.fn(),
  getLocations: jest.fn().mockReturnValue([])
};

describe('Location Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  it('should create a new location', async () => {
    const createLocation = new CreateLocation(mockLocationRepository);
    const location = new Location('1', 'Test Location', 'Test Address');
    await createLocation.run(location);
    expect(mockLocationRepository.createLocation).toHaveBeenCalledWith(
      expect.any(Location)
    );
  });

  it('should find a location by id', async () => {
    const findById = new GetLocationByIdFinder(mockLocationRepository);
    await findById.run('1');
    expect(mockLocationRepository.getLocationById).toHaveBeenCalledWith('1');
  });

  it('should find all locations', async () => {
    const getAllLocations = new LocationFinder(mockLocationRepository);
    await getAllLocations.run();
    expect(mockLocationRepository.getLocations).toHaveBeenCalled();
  });

  it('should delete a location', async () => {
    const deleteLocation = new DeleteLocation(mockLocationRepository);
    await deleteLocation.run('1');
    expect(mockLocationRepository.deleteLocation).toHaveBeenCalledWith('1');
  });
});
