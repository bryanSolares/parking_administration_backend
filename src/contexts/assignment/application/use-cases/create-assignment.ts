//import crypto from 'node:crypto';

import { v4 as uuid } from 'uuid';

import { AssignmentRepository } from '@src/contexts/assignment/core/repositories/assignment-repository';
import { AssignmentEntity } from '@src/contexts/assignment/core/entities/assignment-entity';
import { AssignmentStatus } from '@src/contexts/assignment/core/entities/assignment-entity';

import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { EmployeeEntity } from '@src/contexts/assignment/core/entities/employee-entity';
import { LocationRepository } from '@src/contexts/location/core/repositories/location-repository';
import { Validations } from './validations';
import { TagRepository } from '@src/contexts/parameters/core/repositories/tag-repository';

export class CreateAssignment {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly locationRepository: LocationRepository,
    private readonly tagRepository: TagRepository,
    private readonly validations: Validations
  ) {}

  async run(data: {
    slotId: string;
    employee: {
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
      vehiclesForDelete: Array<string>;
    };
    parkingCardNumber: string;
    tags: string[];
  }): Promise<void> {
    const slot = await this.locationRepository.getSlotById(data.slotId);
    const tags = await this.tagRepository.getTagsByIds(data.tags);

    await this.validations.validateIfCanCreate({
      slot,
      employee: {
        id: data.employee.id,
        vehicles: data.employee.vehicles.map(vehicle => vehicle.id),
        vehiclesForDelete: data.employee.vehiclesForDelete
      },
      tags: {
        request: data.tags,
        database: tags
      }
    });

    const employeeId = uuid();
    const assignmentId = uuid();

    const employee = EmployeeEntity.fromPrimitive({
      ...data.employee,
      id: !data.employee.id ? employeeId : data.employee.id,
      vehicles: data.employee.vehicles.map(vehicle => {
        return {
          ...vehicle,
          employeeId,
          id: vehicle.id ? vehicle.id : uuid()
        };
      })
    });

    const assignment = new AssignmentEntity(
      assignmentId,
      slot!,
      employee,
      data.parkingCardNumber,
      slot!.benefitType,
      AssignmentStatus.ASSIGNED,
      tags
    );

    await this.assignmentRepository.createAssignment(assignment, data.employee.vehiclesForDelete);
  }
}
