import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { LocationNotFound } from '@core/exceptions/location-not-found';

import { GetLocationByIdFinder } from '@application/location/location-by-id-finder';

export class LocationFinderByIdController {
  constructor(private readonly getLocationById: GetLocationByIdFinder) {}

  async run(req: Request, res: Response) {
    //TODO: Validate request with Zod
    try {
      const locationId = req.params.id;
      const location = await this.getLocationById.run(locationId);

      const response = { data: location };
      res.status(200).send(response);
    } catch (error) {
      if (error instanceof LocationNotFound) {
        logger().error(error.message);
        res.status(404).send({ message: error.message });
        return;
      }

      logger().error(error);
      res.status(500).send('Error getting locations');
    }
  }
}
