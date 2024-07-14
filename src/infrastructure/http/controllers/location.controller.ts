import { Request, Response } from 'express';

import { CreateLocation } from '@src/application/location/create-location';
import { UpdateLocation } from '@src/application/location/update-location';
import { DeleteLocation } from '@src/application/location/delete-location';
import { GetLocationByIdFinder } from '@src/application/location/location-by-id-finder';
import { LocationFinder } from '@src/application/location/location-finder';
import { DeleteSlots } from '@src/application/location/delete-slots';

import { LocationNotFoundError } from '@core/exceptions/location-not-found';
import { SlotsEmptyError } from '@src/core/exceptions/slots-empty';

export class LocationController {
  constructor(
    private readonly createLocationUseCase: CreateLocation,
    private readonly updateLocationUseCase: UpdateLocation,
    private readonly deleteLocationUseCase: DeleteLocation,
    private readonly getLocationByIdFinderUseCase: GetLocationByIdFinder,
    private readonly locationFinderUseCase: LocationFinder,
    private readonly deleteSlotsUseCase: DeleteSlots
  ) {}

  async createLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;

    try {
      await this.createLocationUseCase.run(locationData);
      res.status(201).send({ message: 'Location created' });
    } catch (error) {
      res.status(500).send('Error creating location');
    }
  }

  async updateLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;
    const locationId = req.params.id;

    locationData.id = locationId;

    try {
      await this.updateLocationUseCase.run(locationData);
      res.status(200).send({ message: 'Location updated' });
    } catch (error) {
      if (error instanceof LocationNotFoundError) {
        res.status(404).send({ message: error.message });
        return;
      }

      res.status(500).send('Error updating location');
    }
  }

  async deleteLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationId = req.params.id;
    try {
      await this.deleteLocationUseCase.run(locationId);
      res.status(200).send({ message: 'Location deleted' });
    } catch (error) {
      if (error instanceof LocationNotFoundError) {
        res.status(404).send({ message: error.message });
        return;
      }

      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
        return;
      }
    }
  }

  async locationFinderById(req: Request, res: Response) {
    //TODO: Validate request with Zod
    try {
      const locationId = req.params.id;
      const location = await this.getLocationByIdFinderUseCase.run(locationId);

      const response = { data: location };
      res.status(200).send(response);
    } catch (error) {
      if (error instanceof LocationNotFoundError) {
        res.status(404).send({ message: error.message });
        return;
      }

      res.status(500).send('Error getting locations');
    }
  }

  async locationFinder(req: Request, res: Response) {
    try {
      const locations = await this.locationFinderUseCase.run();

      const response = { data: locations };
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send('Error getting locations');
    }
  }

  async deleteSlots(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const slots = req.body.slots;
    try {
      await this.deleteSlotsUseCase.run(slots);
      res.status(200).send({ message: 'Slots deleted' });
    } catch (error) {
      if (error instanceof SlotsEmptyError) {
        res.status(400).send({ message: error.message });
        return;
      }

      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
        return;
      }
    }
  }
}
