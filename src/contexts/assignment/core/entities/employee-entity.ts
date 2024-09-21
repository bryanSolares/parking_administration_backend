import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { VehicleEntity } from './vehicle-entity';

export enum TokenStatus {
  'ACTIVE' = 'ACTIVO',
  'INACTIVE' = 'INACTIVO'
}

export class EmployeeEntity {
  constructor(
    public id: string,
    public readonly employeeCode: string,
    public readonly name: string,
    public readonly workplace: string,
    public readonly identifierDocument: string,
    public readonly company: string,
    public readonly department: string,
    public readonly subManagement: string,
    public readonly management1: string,
    public readonly management2: string,
    public readonly workSite: string,
    public readonly address: string,
    public readonly email: string,
    public readonly phone: string,
    public vehicles: VehicleEntity[],
    public accessToken?: string,
    public accessTokenStatus?: TokenStatus
  ) {
    this.id = id;
    this.employeeCode = employeeCode;
    this.name = name;
    this.workplace = workplace;
    this.identifierDocument = identifierDocument;
    this.company = company;
    this.department = department;
    this.subManagement = subManagement;
    this.management1 = management1;
    this.management2 = management2;
    this.workSite = workSite;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.vehicles = vehicles;
    this.accessToken = accessToken;
    this.accessTokenStatus = accessTokenStatus;
  }

  public static fromPrimitive(primitiveData: {
    id: string;
    employeeCode: string;
    name: string;
    workplace: string;
    identifierDocument: string;
    company: string;
    department: string;
    subManagement: string;
    management1: string;
    management2: string;
    workSite: string;
    address: string;
    email: string;
    phone: string;
    vehicles: {
      id: string;
      vehicleBadge: string;
      color: string;
      brand: string;
      model: string;
      type: VehicleType;
    }[];
    accessToken?: string;
    accessTokenStatus?: TokenStatus;
  }) {
    return new EmployeeEntity(
      primitiveData.id,
      primitiveData.employeeCode,
      primitiveData.name,
      primitiveData.workplace,
      primitiveData.identifierDocument,
      primitiveData.company,
      primitiveData.department,
      primitiveData.subManagement,
      primitiveData.management1,
      primitiveData.management2,
      primitiveData.workSite,
      primitiveData.address,
      primitiveData.email,
      primitiveData.phone,
      primitiveData.vehicles ? primitiveData.vehicles.map(vehicle => VehicleEntity.fromPrimitive(vehicle)) : [],
      primitiveData.accessToken,
      primitiveData.accessTokenStatus
    );
  }

  public toPrimitive() {
    return {
      id: this.id,
      employeeCode: this.employeeCode,
      name: this.name,
      workplace: this.workplace,
      identifierDocument: this.identifierDocument,
      company: this.company,
      department: this.department,
      subManagement: this.subManagement,
      management1: this.management1,
      management2: this.management2,
      workSite: this.workSite,
      address: this.address,
      email: this.email,
      phone: this.phone,
      accessToken: this.accessToken,
      accessTokenStatus: this.accessTokenStatus,
      vehicles: this.vehicles.map(vehicle => vehicle.toPrimitive())
    };
  }
}
