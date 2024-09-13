import { faker } from '@faker-js/faker';
import {
  AssignmentEntity,
  AssignmentStatus
} from '../../../src/assignment/core/entities/assignment-entity';
import { EmployeeEntity } from '../../../src/assignment/core/entities/employee-entity';
import { VehicleEntity } from '../../../src/assignment/core/entities/vehicle-entity';
import {
  CostType,
  VehicleType
} from '../../../src/location/core/entities/slot-entity';
import {
  TagEntity,
  TagStatus
} from '../../../src/parameters/core/entities/tag-entity';

import { LocationMother } from './location-mother';

export class AssignmentMother {
  createAssignmentEntity({
    id = faker.string.uuid(),
    slot = LocationMother.createSlotEntity(),
    employee = this.createEmployeeEntity({}),
    parkingCardNumber = faker.finance.accountNumber(),
    benefitType = CostType.NO_COST,
    status = AssignmentStatus.ASSIGNED,
    tags = []
  }): AssignmentEntity {
    return new AssignmentEntity(
      id,
      slot,
      employee,
      parkingCardNumber,
      benefitType,
      status,
      tags
    );
  }

  createEmployeeEntity({
    id = faker.string.uuid(),
    employeeCode = faker.finance.accountNumber(),
    name = faker.person.fullName(),
    workplace = faker.location.streetAddress(),
    identifierDocument = faker.finance.accountNumber(),
    company = faker.company.name(),
    department = faker.commerce.department(),
    subManagement = faker.company.buzzPhrase(),
    management1 = faker.company.buzzPhrase(),
    management2 = faker.company.buzzPhrase(),
    workSite = faker.company.buzzPhrase(),
    address = faker.location.streetAddress(),
    email = faker.internet.email(),
    phone = faker.phone.number(),
    vehicles = []
  }): EmployeeEntity {
    return new EmployeeEntity(
      id,
      employeeCode,
      name,
      workplace,
      identifierDocument,
      company,
      department,
      subManagement,
      management1,
      management2,
      workSite,
      address,
      email,
      phone,
      vehicles
    );
  }

  createVehicleEntity({
    id = faker.string.uuid(),
    badge = faker.commerce.productName(),
    brand = faker.commerce.productName(),
    model = faker.commerce.productName(),
    type = VehicleType.CAR,
    color = faker.commerce.productMaterial()
  }): VehicleEntity {
    return new VehicleEntity(id, badge, color, brand, model, type);
  }

  createTagEntity({
    id = faker.string.uuid(),
    name = faker.lorem.word(),
    description = faker.lorem.word(),
    status = TagStatus.ACTIVE
  }): TagEntity {
    return new TagEntity(id, name, description, status);
  }
}

export class AssignmentRequestMother {

  static createAssignmentRequest({
    slotId = faker.string.uuid(),
    parkingCardNumber = faker.finance.accountNumber(),
    employee = this.createEmployeeRequest(),
    tags = []
  }: {
    slotId?: string,
    parkingCardNumber?: string,
    employee?: {
      id?: string,
      employeeCode?: string,
      name?: string,
      workplace?: string,
      identifierDocument?: string,
      company?: string,
      department?: string,
      subManagement?: string,
      management1?: string,
      management2?: string,
      workSite?: string,
      address?: string,
      email?: string,
      phone?: string,
      vehicles?: {
        id?: string,
        vehicleBadge?: string,
        brand?: string,
        model?: string,
        type?: VehicleType,
        color?: string,
      }[],
    },
    tags?: string[],
  } = {}): {
    slotId?: string;
    parkingCardNumber?: string;
    employee?: {
      id?: string;
      employeeCode?: string;
      name?: string;
      workplace?: string;
      identifierDocument?: string;
      company?: string;
      department?: string;
      subManagement?: string;
      management1?: string;
      management2?: string;
      workSite?: string;
      address?: string;
      email?: string;
      phone?: string;
      vehicles?: {
        id?: string;
        vehicleBadge?: string;
        brand?: string;
        model?: string;
        type?: VehicleType;
        color?: string;
      }[];
    };
    tags?: string[];
  }{
    return {
      slotId,
      parkingCardNumber,
      employee,
      tags
    }
  }

  static createEmployeeRequest({
    id,
    employeeCode = faker.finance.accountNumber(),
    name = faker.person.fullName(),
    workplace = faker.location.streetAddress(),
    identifierDocument = faker.finance.accountNumber(),
    company = faker.company.name(),
    department = faker.commerce.department(),
    subManagement = faker.company.buzzPhrase(),
    management1 = faker.company.buzzPhrase(),
    management2 = faker.company.buzzPhrase(),
    workSite = faker.company.buzzPhrase(),
    address = faker.location.streetAddress(),
    email = faker.internet.email(),
    phone = '+(502) 45454545',
    vehicles = [this.createVehicleRequest()]
  }: {
    id?: string,
    employeeCode?: string,
    name?: string,
    workplace?: string,
    identifierDocument?: string,
    company?: string,
    department?: string,
    subManagement?: string,
    management1?: string,
    management2?: string,
    workSite?: string,
    address?: string,
    email?: string,
    phone?: string,
    vehicles?: {
      id?: string,
      vehicleBadge?: string,
      brand?: string,
      model?: string,
      type?: VehicleType,
      color?: string,
    }[],
  } = {}): {
    id?: string;
    employeeCode?: string;
    name?: string;
    workplace?: string;
    identifierDocument?: string;
    company?: string;
    department?: string;
    subManagement?: string;
    management1?: string;
    management2?: string;
    workSite?: string;
    address?: string;
    email?: string;
    phone?: string;
    vehicles?: {
      id?: string;
      vehicleBadge?: string;
      brand?: string;
      model?: string;
      type?: VehicleType;
      color?: string;
    }[];
  } {

    return {
      id,
      employeeCode,
      name,
      workplace,
      identifierDocument,
      company,
      department,
      subManagement,
      management1,
      management2,
      workSite,
      address,
      email,
      phone,
      vehicles
    };
  }

  static createVehicleRequest({
    id,
    vehicleBadge = faker.commerce.productName(),
    brand = faker.commerce.productName(),
    model = faker.commerce.productName(),
    type = VehicleType.CAR,
    color = faker.commerce.productMaterial()
  }: {
    id?: string,
    vehicleBadge?: string,
    brand?: string,
    model?: string,
    type?: VehicleType,
    color?: string,
  } = {}): {
    id?: string;
    vehicleBadge?: string;
    brand?: string;
    model?: string;
    type?: VehicleType;
    color?: string;
  } {
    return {
      id,
      vehicleBadge,
      color,
      brand,
      model,
      type
    };
  }
}
