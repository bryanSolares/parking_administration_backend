import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { CreateLocation } from '@application/location/create-location';

export class LocationCreateController {
  constructor(private readonly createLocation: CreateLocation) {}

  async run(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;
    try {
      await this.createLocation.run(locationData as Location);
      res.status(201).send({ message: 'Location created' });
    } catch (error) {
      logger().error(error);
      res.status(500).send('Error creating location');
    }
  }
}
