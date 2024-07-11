import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { LocationFinder } from '@application/location/location-finder';

export class LocationFinderController {
  constructor(private readonly getLocations: LocationFinder) {}

  async run(req: Request, res: Response) {
    try {
      const locations = await this.getLocations.run();

      const response = { data: locations };
      res.status(200).send(response);
    } catch (error) {
      logger().error(error);
      res.status(500).send('Error getting locations');
    }
  }
}
