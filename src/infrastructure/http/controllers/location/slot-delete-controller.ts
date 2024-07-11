import { Request, Response } from 'express';

import { logger } from '@config/logger/load-logger';

import { DeleteSlots } from '@application/location/delete-slots';
import { SlotsEmptyError } from '@src/core/exceptions/slots-empty';

export class SlotsDeleteController {
  constructor(private readonly deleteLocation: DeleteSlots) {}

  async run(req: Request, res: Response) {
    //TODO: Validate request with Zod
    const slots = req.body.slots;
    try {
      await this.deleteLocation.run(slots);
      res.status(200).send({ message: 'Slots deleted' });
    } catch (error) {
      if (error instanceof SlotsEmptyError) {
        logger().error(error.message);
        res.status(404).send({ message: error.message });
        return;
      }

      logger().error(error);
      res.status(500).send('Error deleting location');
    }
  }
}
