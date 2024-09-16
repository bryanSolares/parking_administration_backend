import { Op } from 'sequelize';
import { sequelize } from '@config/database/sequelize';
import { QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentStatus } from '@assignment-module-core/entities/assignment-entity';
import { FinderResultById } from '@assignment-module-core/repositories/assignment-repository';
import { FinderResultPreviousAssignment } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { ListOfFunctions } from '@assignment-module-core/repositories/assignment-repository';
import { ReturnType } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentFinderResult } from '@assignment-module-core/repositories/assignment-repository';

import { DiscountNoteEntity } from '@assignment-module-core/entities/discount-note-entity';
import { DiscountNodeStatusSignature } from '@assignment-module-core/entities/discount-note-entity';
import { DiscountNoteDispatchedStatus } from '@assignment-module-core/entities/discount-note-entity';
import { EmployeeEntity } from '@assignment-module-core/entities/employee-entity';
import { VehicleEntity } from '@assignment-module-core/entities/vehicle-entity';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { DeAssignmentEntity } from '@assignment-module-core/entities/deassignment-entity';

import { AssignmentLoanModel } from '@config/database/models/assignment-loan';
import { AssignmentModel } from '@config/database/models/assignment.model';
import { EmployeeModel } from '@config/database/models/employee.model';
import { VehicleModel } from '@config/database/models/vehicle.model';
import { SlotModel } from '@config/database/models/slot.model';
import { LocationModel } from '@config/database/models/location.model';
import { DeAssignmentModel } from '@config/database/models/de-assignment.model';
import { DiscountNoteModel } from '@config/database/models/discount-note.model';
import { AssignmentTagDetailModel } from '@src/server/config/database/models/assignment-tag-detail';
import { TagModel } from '@src/server/config/database/models/tag.model';
import { SlotEntity } from '@src/location/core/entities/slot-entity';
import { VehicleType } from '@src/location/core/entities/slot-entity';
import { TagEntity } from '@src/parameters/core/entities/tag-entity';
import { TagStatus } from '@src/parameters/core/entities/tag-entity';
import { LocationEntity } from '@src/location/core/entities/location-entity';
import { format } from '@formkit/tempo';

export class SequelizeAssignmentRepository implements AssignmentRepository {
  async createAssignment(assignment: AssignmentEntity): Promise<void> {
    const ownerData = assignment.employee;
    const vehiclesOwnerData = assignment.employee.vehicles;

    const transaction = await sequelize.transaction();
    //Save employee
    const ownerIdSaved = await this.upsertEmployee(ownerData, transaction);
    //Save vehicles
    await this.upsertVehicles(vehiclesOwnerData, ownerIdSaved, transaction);
    //Save assignment
    const assignmentSaved = await AssignmentModel.create(
      {
        ...assignment,
        slotId: assignment.slot.id,
        employeeId: ownerIdSaved
      },
      { transaction }
    );

    await AssignmentTagDetailModel.bulkCreate(
      assignment.tags.map(tag => {
        return {
          id: uuid(),
          tagId: tag.id,
          assignmentId: assignmentSaved.getDataValue('id')
        };
      }),
      { transaction }
    );

    await transaction.commit();
  }

  /* eslint-disable  @typescript-eslint/no-unsafe-call */
  async getAssignmentById(id: string): Promise<FinderResultById | null> {
    const assignmentDatabase = await AssignmentModel.findOne({
      where: { id },
      include: [
        {
          model: EmployeeModel,
          include: [
            {
              model: VehicleModel
            }
          ]
        },
        {
          model: SlotModel,
          include: [
            {
              model: LocationModel
            }
          ]
        },
        {
          model: TagModel
        },
        {
          model: DiscountNoteModel,
          required: false
        },
        {
          model: AssignmentLoanModel,
          where: { status: 'ACTIVO' },
          required: false,
          include: [
            { model: EmployeeModel, include: [{ model: VehicleModel }] }
          ]
        }
      ]
    });

    if (!assignmentDatabase) return null;

    const plainData = assignmentDatabase.get({
      plain: true
    });

    const employeeData = EmployeeEntity.fromPrimitive(plainData.employee);

    employeeData.vehicles = plainData.employee.vehicles.map(
      (vehicle: {
        id: string;
        vehicleBadge: string;
        color: string;
        brand: string;
        model: string;
        type: VehicleType;
      }) => {
        return VehicleEntity.fromPrimitive(vehicle);
      }
    );

    const tagsData = plainData.tags.map(
      (tag: {
        id: string;
        name: string;
        description: string;
        status: TagStatus;
      }) => TagEntity.fromPrimitives(tag)
    );

    const locationData = LocationEntity.fromPrimitives({
      ...plainData.slot.location,
      slots: [SlotEntity.fromPrimitives(plainData.slot)]
    });

    const assignment: FinderResultById = {
      id: plainData.id,
      assignmentDate: plainData.assignmentDate ?? '',
      formDecisionDate: plainData.formDecisionDate ?? '',
      parkingCardNumber: plainData.parkingCardNumber,
      benefitType: plainData.benefitType,
      status: plainData.status as AssignmentStatus,
      employee: employeeData,
      tags: tagsData,
      location: locationData,
      discountNote: plainData.discount_note
        ? DiscountNoteEntity.fromPrimitives(plainData.discount_note)
        : undefined,
      assignmentLoan: plainData.assignment_loan
        ? AssignmentLoadEntity.fromPrimitives(plainData.assignment_loan)
        : undefined
    };

    return assignment;
  }

  /* eslint-disable   @typescript-eslint/no-unsafe-return */
  async getAssignments(
    limit: number = 20,
    page: number = 1
  ): Promise<AssignmentFinderResult> {
    const assignmentsCounter = await AssignmentModel.count();
    const allPages = Math.ceil(assignmentsCounter / limit);
    const offset = (page - 1) * limit;

    const assignments = await AssignmentModel.findAll({
      include: [
        {
          model: SlotModel,
          attributes: ['id', 'slotNumber'],
          include: [
            {
              model: LocationModel,
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: EmployeeModel,
          attributes: ['id', 'name', 'email', 'phone'],
          include: [{ model: VehicleModel }]
        },
        {
          model: DiscountNoteModel
        },
        {
          model: DeAssignmentModel,
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    if (assignments.length === 0) {
      return { data: [], pageCounter: allPages };
    }

    const plainData = assignments.map(assignment =>
      assignment.get({ plain: true })
    );

    const data = plainData.map(plainResult => {
      return {
        id: plainResult.id,
        status: plainResult.status as AssignmentStatus,
        assignmentDate: plainResult.assignmentDate ?? '',
        formDecisionDate: plainResult.decisionDate ?? '',
        parkingCardNumber: plainResult.parkingCardNumber,
        benefitType: plainResult.benefitType,
        employee: EmployeeEntity.fromPrimitive(plainResult.employee),
        location: LocationEntity.fromPrimitives({
          ...plainResult.slot.location,
          slots: [SlotEntity.fromPrimitives(plainResult.slot)]
        }),
        discountNote: plainResult.discount_note
          ? DiscountNoteEntity.fromPrimitives(plainResult.discount_note)
          : undefined,
        deAssignment: plainResult.de_assignment
          ? DeAssignmentEntity.fromPrimitives(plainResult.de_assignment)
          : undefined
      };
    });

    return { data, pageCounter: allPages };
  }

  async createDeAssignment(deAssignment: DeAssignmentEntity): Promise<void> {
    await DeAssignmentModel.create({
      ...deAssignment.toPrimitives(),
      id: uuid(),
      assignmentId: deAssignment.assignmentId
    });
  }

  async createDiscountNote(discountNote: DiscountNoteEntity): Promise<void> {
    await DiscountNoteModel.create(discountNote.toPrimitives());
  }

  async getDiscountNoteById(id: string): Promise<DiscountNoteEntity | null> {
    const discountNote = await DiscountNoteModel.findOne({
      where: { id }
    });

    if (!discountNote) return null;

    return DiscountNoteEntity.fromPrimitives(discountNote.get({ plain: true }));
  }

  async updateStatusDiscountNote(
    id: string,
    status: DiscountNodeStatusSignature
  ): Promise<void> {
    await DiscountNoteModel.update(
      {
        statusSignature: status,
        statusDispatched: DiscountNoteDispatchedStatus.SUCCESS
      },
      { where: { id } }
    );
  }

  async executeFunction(
    functionName: ListOfFunctions,
    parameters: string[]
  ): Promise<ReturnType> {
    const [result]: { [key: string]: ReturnType }[] = await sequelize.query(
      `select ${functionName}(?)`,
      {
        replacements: parameters,
        type: QueryTypes.SELECT
      }
    );

    return Object.values(result)[0];
  }

  async createAssignmentLoan(
    assignmentLoan: AssignmentLoadEntity
  ): Promise<void> {
    const employeeData = assignmentLoan.employee;
    const vehiclesData = assignmentLoan.employee.vehicles;

    const transaction = await sequelize.transaction();

    //Upsert employee
    const employeeId = await this.upsertEmployee(employeeData, transaction);

    //Upsert vehicles
    await this.upsertVehicles(vehiclesData, employeeId, transaction);

    //Add loan assignment
    await AssignmentLoanModel.create(
      {
        ...assignmentLoan,
        employeeId
      },
      { transaction }
    );

    await transaction.commit();
  }

  async updateAssignmentLoan(
    assignmentLoan: AssignmentLoadEntity,
    vehiclesForDelete: string[]
  ): Promise<void> {
    const vehiclesData = assignmentLoan.employee.vehicles;

    const transaction = await sequelize.transaction();

    await this.upsertVehicles(
      vehiclesData,
      assignmentLoan.employee.id,
      transaction
    );

    await Promise.all(
      vehiclesForDelete.map(
        async id => await VehicleModel.destroy({ where: { id } })
      )
    );

    await AssignmentLoanModel.update(
      {
        startDateAssignment: assignmentLoan.startDateAssignment,
        endDateAssignment: assignmentLoan.endDateAssignment
      },
      { where: { id: assignmentLoan.id } }
    );

    await transaction.commit();
  }

  async getAssignmentLoanByIdAssignment(
    assignmentId: string
  ): Promise<AssignmentLoadEntity | null> {
    const assignmentLoan = await AssignmentLoanModel.findOne({
      where: { assignmentId, status: 'ACTIVO' },
      include: [{ model: EmployeeModel, as: 'employee' }]
    });

    if (!assignmentLoan) return null;

    return AssignmentLoadEntity.fromPrimitives(
      assignmentLoan.get({ plain: true })
    );
  }

  async getAssignmentLoanById(
    id: string
  ): Promise<AssignmentLoadEntity | null> {
    const assignmentLoan = await AssignmentLoanModel.findOne({
      where: { id },
      include: [{ model: EmployeeModel, as: 'employee' }]
    });

    if (!assignmentLoan) return null;

    return AssignmentLoadEntity.fromPrimitives(
      assignmentLoan.get({ plain: true })
    );
  }

  async deleteAssignmentLoan(assignmentLoanId: string): Promise<void> {
    await AssignmentLoanModel.destroy({
      where: { id: assignmentLoanId }
    });
  }

  async updateAssignment(
    assignment: AssignmentEntity,
    vehicleIdsForDelete: string[]
  ): Promise<void> {
    const transaction = await sequelize.transaction();

    if (vehicleIdsForDelete.length > 0) {
      await VehicleModel.destroy({
        where: {
          id: {
            [Op.in]: vehicleIdsForDelete
          },
          employeeId: {
            [Op.in]: [assignment.employee.id]
          }
        },
        transaction
      });
    }
    //update vehicles owner
    await this.upsertVehicles(
      assignment.employee.vehicles,
      assignment.employee.id,
      transaction
    );

    if (assignment.tags.length > 0) {
      await AssignmentTagDetailModel.destroy({
        where: { assignmentId: assignment.id },
        transaction
      });
      await AssignmentTagDetailModel.bulkCreate(
        assignment.tags.map(tag => ({
          id: uuid(),
          assignmentId: assignment.id,
          tagId: tag.id
        })),
        { transaction }
      );
    }

    await transaction.commit();
  }

  /* eslint-disable  @typescript-eslint/no-unsafe-return */
  async upsertEmployee(
    employee: EmployeeEntity,
    transaction?: Transaction
  ): Promise<string> {
    const [employeeDatabase] = await EmployeeModel.upsert(
      {
        ...employee,
        id: employee.id
      },
      {
        fields: [
          'id',
          'codeEmployee',
          'name',
          'workplace',
          'identifierDocument',
          'company',
          'department',
          'subManagement',
          'management1',
          'management2',
          'workSite',
          'address',
          'email',
          'phone'
        ],
        transaction
      }
    );

    return employeeDatabase.getDataValue('id');
  }

  async upsertVehicles(
    vehicles: VehicleEntity[],
    ownerVehicle: string,
    transaction?: Transaction
  ): Promise<void> {
    await Promise.all(
      vehicles.map(async vehicle => {
        await VehicleModel.upsert(
          {
            ...vehicle,
            id: vehicle.id,
            employee_id: ownerVehicle
          },
          { transaction }
        );
      })
    );
  }

  async changeStatusAssignment(
    assignmentId: string,
    status: AssignmentStatus,
    assignmentDate?: string
  ): Promise<void> {
    if (
      status === AssignmentStatus.ACCEPTED ||
      status === AssignmentStatus.CANCELLED ||
      status === AssignmentStatus.REJECTED
    ) {
      await AssignmentModel.update(
        {
          status,
          formDecisionDate: format({
            date: new Date(),
            format: 'YYYY-MM-DD',
            tz: 'America/Guatemala'
          })
        },
        { where: { id: assignmentId } }
      );
    }

    if (status === AssignmentStatus.IN_PROGRESS && assignmentDate) {
      await AssignmentModel.update(
        { status, assignmentDate },
        { where: { id: assignmentId } }
      );
    }
  }

  async getLastAssignmentInactiveBySlotId(
    slotId: string
  ): Promise<FinderResultPreviousAssignment | null> {
    const assignmentDatabase = await AssignmentModel.findOne({
      where: {
        slotId,
        status: {
          [Op.in]: [
            AssignmentStatus.AUTO_DE_ASSIGNMENT,
            AssignmentStatus.MANUAL_DE_ASSIGNMENT
          ]
        }
      },
      include: [
        {
          model: EmployeeModel,
          include: [{ model: VehicleModel }]
        },
        {
          model: DeAssignmentModel,
          required: true,
          order: [
            ['deAssignmentDate', 'DESC'],
            ['updated_at', 'DESC']
          ]
        }
      ],
      order: [['updated_at', 'DESC']],
      limit: 1
    });

    if (!assignmentDatabase) return null;
    const plainData = assignmentDatabase.get({ plain: true });

    return {
      id: plainData.id,
      benefitType: plainData.benefitType,
      formDecisionDate: plainData.decisionDate,
      parkingCardNumber: plainData.parkingCardNumber,
      status: plainData.status,
      assignmentDate: plainData.assignmentDate,
      employee: EmployeeEntity.fromPrimitive(plainData.employee),
      deAssignment: DeAssignmentEntity.fromPrimitives(plainData.de_assignment)
    };
  }
}
