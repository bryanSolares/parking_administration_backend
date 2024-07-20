import { VehicleEntity } from './vehicle-entity';

export class EmployeeEntity {
  constructor(
    public id: string,
    public readonly code_employee: string,
    public readonly name: string,
    public readonly workplace: string,
    public readonly identifier_document: string,
    public readonly company: string,
    public readonly department: string,
    public readonly sub_management: string,
    public readonly management_1: string,
    public readonly management_2: string,
    public readonly work_site: string,
    public readonly address: string,
    public readonly email: string,
    public readonly phone: string,
    public access_token: string,
    public access_token_status: string,
    public vehicles: VehicleEntity[]
  ) {}
}

// Value Object for email and phone
