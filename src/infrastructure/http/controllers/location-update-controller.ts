import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { LocationNotFoundError } from '@core/exceptions/location-not-found';

import { UpdateLocation } from '@application/location/update-location';

export class LocationUpdateController {
  constructor(private readonly updateLocation: UpdateLocation) {}

  async run(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;
    const locationId = req.params.id;

    locationData.id = locationId;

    try {
      await this.updateLocation.run(locationData);
      res.status(200).send({ message: 'Location updated' });
    } catch (error) {
      if (error instanceof LocationNotFoundError) {
        logger().error(error.message);
        res.status(404).send({ message: error.message });
        return;
      }

      logger().error(error);
      res.status(500).send('Error updating location');
    }
  }
}
