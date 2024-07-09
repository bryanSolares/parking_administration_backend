import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { LocationNotFound } from '@core/exceptions/location-not-found';

import { DeleteLocation } from '@application/location/delete-location';

export class LocationDeleteController {
  constructor(private readonly deleteLocation: DeleteLocation) {}

  async run(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationId = req.params.id;
    try {
      await this.deleteLocation.run(locationId);
      res.status(200).send({ message: 'Location deleted' });
    } catch (error) {
      if (error instanceof LocationNotFound) {
        logger().error(error.message);
        res.status(404).send({ message: error.message });
        return;
      }

      logger().error(error);
      res.status(500).send('Error deleting location');
    }
  }
}
