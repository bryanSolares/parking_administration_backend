import { Request, Response } from 'express';

import { logger } from '../config/logger/load-logger';

import { dependencyContainer } from '../../mooc/infrastructure/config/DependencyContainer';
import { LocationNotFound } from '../../mooc/core/errors/LocationNotFound';

export class LocationController {
  static async createLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;
    try {
      await dependencyContainer.createLocationUseCase.execute(locationData);
      res.status(201).send({ message: 'Location created' });
    } catch (error) {
      logger().error(error);
      res.status(500).send('Error creating location');
    }
  }

  static async updateLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationData = req.body;
    const locationId = req.params.id;

    locationData.id = locationId;

    try {
      await dependencyContainer.updateLocationUseCase.execute(locationData);
      res.status(200).send({ message: 'Location updated' });
    } catch (error) {
      if (error instanceof LocationNotFound) {
        logger().error(error.message);
        res.status(404).send({ message: error.message });
        return;
      }

      logger().error(error);
      res.status(500).send('Error updating location');
    }
  }

  static async deleteLocation(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const locationId = req.params.id;
    try {
      await dependencyContainer.deleteLocationUseCase.execute(locationId);
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

  static async getLocations(req: Request, res: Response) {
    try {
      const locations =
        await dependencyContainer.getAllLocationsUseCase.execute();

      const response = { data: locations };
      res.status(200).send(response);
    } catch (error) {
      logger().error(error);
      res.status(500).send('Error getting locations');
    }
  }

  static async getLocationById(req: Request, res: Response) {
    //TODO: Validate request with Zod
    try {
      const locationId = req.params.id;
      const location =
        await dependencyContainer.getLocationByIdUseCase.execute(locationId);

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
