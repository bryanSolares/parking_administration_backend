import { SlotEntity } from './slot-entity';

export class LocationEntity {
  constructor(
    public id: string,
    public name: string,
    public address: string,
    public readonly slots: SlotEntity[],
    public contact_reference?: string,
    public phone?: string,
    public email?: string,
    public comments?: string,
    public latitude?: number,
    public longitude?: number,
    public status?: string
  ) {}

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    address: string;
    slots: SlotEntity[];
    contact_reference?: string;
    phone?: string;
    email?: string;
    comments?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
  }) {
    return new LocationEntity(
      plainData.id,
      plainData.name,
      plainData.address,
      plainData.slots,
      plainData.contact_reference,
      plainData.phone,
      plainData.email,
      plainData.comments,
      plainData.latitude,
      plainData.longitude,
      plainData.status
    );
  }
}
