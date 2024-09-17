import { de, faker } from '@faker-js/faker';
import {
  AssignmentEntity,
  AssignmentStatus
} from '../../../src/assignment/core/entities/assignment-entity';
import { AssignmentModel } from '../../../src/server/config/database/models/assignment.model';
import { LocationBuilder, SlotBuilder } from './location-builder';
import { EmployeeBuilder } from './employee-builder';
import {
  CostType,
  SlotEntity
} from '../../../src/location/core/entities/slot-entity';
import { EmployeeEntity } from '../../../src/assignment/core/entities/employee-entity';
import { TagEntity } from '../../../src/parameters/core/entities/tag-entity';
import { VehicleBuilder } from './vehicle-builder';

export class AssignmentBuilder {
  private _assignmentEntity: AssignmentEntity;

  constructor() {
    this._assignmentEntity = this.createAssignmentEntity({});
  }

  private createAssignmentEntity({
    id = faker.string.uuid(),
    slot = new SlotBuilder().slotEntity,
    employee = new EmployeeBuilder().employeeEntity,
    parkingCardNumber = faker.finance.accountNumber(),
    benefitType = CostType.NO_COST,
    status = AssignmentStatus.ASSIGNED,
    tags = []
  }: {
    id?: string;
    slot?: SlotEntity;
    employee?: EmployeeEntity;
    parkingCardNumber?: string;
    benefitType?: CostType;
    status?: AssignmentStatus;
    tags?: TagEntity[];
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

  public async buildWithActiveStatus(
    status:
      | AssignmentStatus.ASSIGNED
      | AssignmentStatus.IN_PROGRESS
      | AssignmentStatus.ACCEPTED,
    formDecisionDate?: string
  ): Promise<AssignmentEntity> {
    const location = await new LocationBuilder().withActiveStatus().build();
    const slot = await new SlotBuilder()
      .withTypeSingle()
      .withOccupiedStatus()
      .build(location.id);
    const employee = await new EmployeeBuilder().build();
    await new VehicleBuilder().build(employee.id);
    this._assignmentEntity.employee = employee;
    this._assignmentEntity.slot = slot;
    this._assignmentEntity.status = status;
    this._assignmentEntity.formDecisionDate = formDecisionDate;

    await AssignmentModel.create({
      ...this._assignmentEntity.toPrimitive(),
      status,
      employeeId: employee.id,
      slotId: this._assignmentEntity.slot.id
    });
    return this._assignmentEntity;
  }

  public async buildWithCancelledOrRejectStatus(
    status: AssignmentStatus.CANCELLED | AssignmentStatus.REJECTED,
    formDecisionDate: string
  ): Promise<AssignmentEntity> {
    const location = await new LocationBuilder().withActiveStatus().build();
    const slot = await new SlotBuilder()
      .withTypeSingle()
      .withAvailableStatus()
      .build(location.id);
    const employee = await new EmployeeBuilder().build();
    await new VehicleBuilder().build(employee.id);
    this._assignmentEntity.employee = employee;
    this._assignmentEntity.slot = slot;
    this._assignmentEntity.status = status;
    this._assignmentEntity.formDecisionDate = formDecisionDate;

    await AssignmentModel.create({
      ...this._assignmentEntity.toPrimitive(),
      status,
      employeeId: employee.id,
      slotId: this._assignmentEntity.slot.id
    });
    return this._assignmentEntity;
  }

  public async buildWithDeAssignedStatus(
    status:
      | AssignmentStatus.MANUAL_DE_ASSIGNMENT
      | AssignmentStatus.AUTO_DE_ASSIGNMENT
  ): Promise<AssignmentEntity> {
    const location = await new LocationBuilder().withActiveStatus().build();
    const slot = await new SlotBuilder()
      .withTypeSingle()
      .withAvailableStatus()
      .build(location.id);
    const employee = await new EmployeeBuilder().build();
    await new VehicleBuilder().build(employee.id);

    this._assignmentEntity.employee = employee;
    this._assignmentEntity.slot = slot;
    this._assignmentEntity.status = status;

    await AssignmentModel.create({
      ...this._assignmentEntity.toPrimitive(),
      status,
      employeeId: employee.id,
      slotId: this._assignmentEntity.slot.id
    });

    return this._assignmentEntity;
  }

  public async buildWithActiveStatusFromSlotProvided(
    status:
      | AssignmentStatus.ASSIGNED
      | AssignmentStatus.IN_PROGRESS
      | AssignmentStatus.ACCEPTED,
      slot: SlotEntity
  ): Promise<AssignmentEntity> {
    const employee = await new EmployeeBuilder().build();
    await new VehicleBuilder().build(employee.id);

    this._assignmentEntity.employee = employee;
    this._assignmentEntity.status = status;
    this._assignmentEntity.slot = slot;

    await AssignmentModel.create({
      ...this._assignmentEntity.toPrimitive(),
      status,
      employeeId: employee.id,
      slotId: this._assignmentEntity.slot.id
    });

    return this._assignmentEntity;
  }

  public get assignmentEntity(): AssignmentEntity {
    return this._assignmentEntity;
  }
}
