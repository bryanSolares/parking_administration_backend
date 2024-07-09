import { SlotEntity } from './slot-entity';

export class Location {
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
    public status?: string,
    public created_at?: Date,
    public updated_at?: Date
  ) {}
}
