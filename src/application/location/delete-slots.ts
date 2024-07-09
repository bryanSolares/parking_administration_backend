import { LocationRepository } from '@core/repositories/location-repository';
import { SlotsEmptyError } from '@core/exceptions/slots-empty';

export class DeleteSlots {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(slots: string[]): Promise<void> {
    if (!slots.length) {
      throw new SlotsEmptyError('Slots cant be empty');
    }

    await this.locationRepository.deleteSlots(slots);
  }
}
