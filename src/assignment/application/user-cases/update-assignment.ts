import { v4 as uuid } from 'uuid';
import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { TagRepository } from '@src/parameters/core/repositories/tag-repository';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { AppError } from '@src/server/config/err/AppError';
import { AssignmentEntity } from '@src/assignment/core/entities/assignment-entity';
import { AssignmentStatus } from '@src/assignment/core/entities/assignment-entity';
import { Validations } from './validations';
import { VehicleEntity } from '@src/assignment/core/entities/vehicle-entity';

export class UpdateAssignmentUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly tagRepository: TagRepository,
    private readonly validations: Validations
  ) {}

  async run(
    data: {
      employee: {
        vehicles: {
          id: string;
          vehicleBadge: string;
          color: string;
          brand: string;
          model: string;
          type: VehicleType;
        }[];
      };
      tags: string[];
      vehicleIdsForDelete: string[];
    },
    assignmentId: string
  ): Promise<void> {
    const assignmentDatabase = await this.assignmentRepository.getAssignmentById(assignmentId);
    if (!assignmentDatabase) {
      throw new AppError('ASSIGNMENT_NOT_FOUND', 404, 'Assignment not found', true);
    }

    if (
      ![AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS, AssignmentStatus.ACCEPTED].some(
        status => status === assignmentDatabase.status
      )
    ) {
      throw new AppError(
        'INACTIVE_ASSIGNMENT',
        400,
        'You can not update an assignment that is canceled or it is de-assigned',
        true
      );
    }

    await this.validations.validateIfVehiclesBelongToEmployee(assignmentDatabase.employee.id, data.employee.vehicles);

    await this.validations.validateIfVehiclesBelongToEmployee(
      assignmentDatabase.employee.id,
      data.vehicleIdsForDelete.map(id => ({ id }))
    );

    //TODO: Refactor this
    const tagsDatabase = await this.tagRepository.getTagsByIds(data.tags.map(id => id));
    this.validations.validateIfTagsAreValid({
      database: tagsDatabase,
      request: data.tags.map(id => id)
    });

    assignmentDatabase.employee.vehicles = data.employee.vehicles.map(vehicle =>
      VehicleEntity.fromPrimitive({ ...vehicle, id: vehicle.id ?? uuid() })
    );

    const assignment = new AssignmentEntity(
      assignmentDatabase.id,
      assignmentDatabase.location.slots[0],
      assignmentDatabase.employee,
      assignmentDatabase.parkingCardNumber,
      assignmentDatabase.benefitType,
      assignmentDatabase.status,
      tagsDatabase
    );

    await this.assignmentRepository.updateAssignment(assignment, data.vehicleIdsForDelete);
  }
}
