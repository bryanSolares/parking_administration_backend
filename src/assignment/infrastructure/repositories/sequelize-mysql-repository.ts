//import { Op } from 'sequelize';
import { sequelize } from '@config/database/sequelize';
import { QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { AssignmentEntity } from '@assignment-module-core/entities/assignment-entity';
import { AssignmentRepository } from '@assignment-module-core/repositories/assignment-repository';
import { AssignmentFinderResult } from '@assignment-module-core/repositories/assignment-repository';

import { DiscountNoteEntity } from '@assignment-module-core/entities/discount-note-entity';
import { EmployeeEntity } from '@assignment-module-core/entities/employee-entity';
import { VehicleEntity } from '@assignment-module-core/entities/vehicle-entity';
import { ScheduleEntity } from '@assignment-module-core/entities/schedule-entity';
import { AssignmentLoadEntity } from '@assignment-module-core/entities/assignment-load-entity';
import { DeAssignmentEntity } from '@assignment-module-core/entities/deassignment-entity';

import { AssignmentLoanModel } from '@config/database/models/assignment-loan';
import { AssignmentModel } from '@config/database/models/assignment.model';
import { EmployeeModel } from '@config/database/models/employee.model';
import { VehicleModel } from '@config/database/models/vehicle.model';
import { ScheduleModel } from '@config/database/models/schedule.model';
import { SlotModel } from '@config/database/models/slot.model';
import { LocationModel } from '@config/database/models/location.model';
import { DeAssignmentModel } from '@config/database/models/de-assignment.model';
import { DiscountNoteModel } from '@config/database/models/discount-note.model';
//import { AssignmentTagDetailModel } from '@src/server/config/database/models/assignment-tag-detail';

export class SequelizeAssignmentRepository implements AssignmentRepository {
  async createAssignment(assignment: AssignmentEntity): Promise<void> {
    const ownerData = assignment.employee;
    const vehiclesOwnerData = assignment.employee.vehicles;

    // const scheduleData = assignment.schedule;
    // const tags = assignment.tags;
    // const loanAssignmentData = assignment.assignment_loan;
    // const guestData = assignment.assignment_loan?.employee;
    // const vehiclesGuestData = assignment.assignment_loan?.employee.vehicles;
    // let scheduleIdSaved;

    const transaction = await sequelize.transaction();
    //Save employee
    const ownerIdSaved = await this.upsertEmployee(ownerData, transaction);
    //Save vehicles
    await this.upsertVehicles(vehiclesOwnerData, ownerIdSaved, transaction);
    // //Save Schedule
    // if (scheduleData) {
    //   scheduleIdSaved = await this.upsertSchedule(
    //     scheduleData,
    //     assignment.slot_id,
    //     transaction
    //   );
    // }
    // //Save assignment
    await AssignmentModel.create(
      {
        ...assignment,
        slotId: assignment.slot.id,
        employeeId: ownerIdSaved
      },
      { transaction }
    );

    // if (loanAssignmentData && guestData && vehiclesGuestData) {
    //   const guestIdSaved = await this.upsertEmployee(guestData, transaction);
    //   //Save vehicles
    //   await this.upsertVehicles(vehiclesGuestData, guestIdSaved, transaction);
    //   //Save Assignment Loan
    //   await AssignmentLoanModel.create(
    //     {
    //       ...loanAssignmentData,
    //       id: uuid(),
    //       employee_id: guestIdSaved,
    //       assignment_id: assignmentSaved.getDataValue('id')
    //     },
    //     { transaction }
    //   );
    // }
    await SlotModel.update(
      { status: 'OCUPADO' },
      { where: { id: assignment.slot.id }, transaction }
    );

    // await AssignmentTagDetailModel.bulkCreate(
    //   tags.map(tag => ({
    //     id: uuid(),
    //     tag_id: tag,
    //     assignment_id: assignmentSaved.getDataValue('id')
    //   })),
    //   { transaction }
    // );

    await transaction.commit();
  }

  async getDiscountNoteById(id: string): Promise<DiscountNoteEntity | null> {
    const discountNote = await DiscountNoteModel.findOne({
      where: { id }
    });

    return discountNote?.get({ plain: true }) as DiscountNoteEntity;
  }

  async createDiscountNote(idAssignment: string): Promise<void> {
    await DiscountNoteModel.create(
      {
        id: uuid(),
        assignment_id: idAssignment,
        status_dispatched: 'EXITOSO',
        last_notice: new Date()
      },
      { fields: ['id', 'assignment_id', 'status_dispatched', 'last_notice'] }
    );
  }

  async createDeAssignment(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const transaction = await sequelize.transaction();

    if (Object.values(deAssignment).length !== 0) {
      await AssignmentModel.update(
        { status: 'INACTIVO' },
        { where: { id: assignmentId }, transaction }
      );

      await DeAssignmentModel.create(
        { ...deAssignment, id: uuid(), assignment_id: assignmentId },
        { transaction }
      );
    } else {
      await AssignmentLoanModel.update(
        {
          status: 'INACTIVO'
        },
        {
          where: { assignment_id: assignmentId },
          transaction
        }
      );
    }

    await transaction.commit();
  }

  async getAssignments(
    limit: number = 20,
    page: number = 1
  ): Promise<AssignmentFinderResult | null> {
    const assignmentsCounter = await AssignmentModel.count();
    const allPages = Math.ceil(assignmentsCounter / limit);
    const offset = (page - 1) * limit;

    const assignments = await AssignmentModel.findAll({
      attributes: {
        exclude: ['slot_id', 'schedule_id', 'employee_id', 'updated_at']
      },
      include: [
        {
          model: SlotModel,
          attributes: ['slot_number'],
          include: [
            {
              model: LocationModel,
              attributes: ['name']
            }
          ]
        },
        {
          model: EmployeeModel,
          attributes: ['name', 'email', 'phone']
        },
        {
          model: DiscountNoteModel,
          attributes: {
            exclude: [
              'assignment_id',
              'reminder_frequency',
              'max_dispatch_attempts',
              'created_at',
              'updated_at'
            ]
          }
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const assignmentsData = assignments.map(
      assignment => assignment.get({ plain: true }) as AssignmentEntity
    );

    return { data: assignmentsData, pageCounter: allPages };
  }

  async getAssignmentById(id: string): Promise<AssignmentEntity | null> {
    const listExcludedAttributes = ['created_at', 'updated_at'];

    const assignment = await AssignmentModel.findOne({
      where: { id },
      include: [
        {
          model: EmployeeModel,
          attributes: {
            exclude: listExcludedAttributes
          },
          include: [
            {
              model: VehicleModel,
              attributes: {
                exclude: [...listExcludedAttributes, 'employee_id']
              }
            }
          ]
        },
        {
          model: SlotModel,
          attributes: {
            exclude: [...listExcludedAttributes, 'location_id']
          },
          include: [
            {
              model: LocationModel,
              attributes: {
                exclude: listExcludedAttributes
              }
            }
          ]
        },
        {
          model: ScheduleModel,
          attributes: { exclude: [...listExcludedAttributes, 'slot_id'] }
        },
        {
          model: AssignmentLoanModel,
          include: [
            {
              model: EmployeeModel,
              attributes: {
                exclude: listExcludedAttributes
              },

              include: [
                {
                  model: VehicleModel,
                  attributes: {
                    exclude: [...listExcludedAttributes, 'employee_id']
                  }
                }
              ]
            }
          ],
          where: { status: 'ACTIVO' },
          required: false,
          attributes: {
            exclude: [...listExcludedAttributes, 'assignment_id']
          }
        },
        {
          model: DiscountNoteModel,
          attributes: {
            exclude: [
              ...listExcludedAttributes,
              'assignment_id',
              'reminder_frequency',
              'max_dispatch_attempts'
            ]
          }
        }
      ],
      attributes: ['id', 'assignment_date', 'status']
    });

    return assignment?.get({ plain: true }) as AssignmentEntity;
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
        id: uuid(),
        employee_id: employeeId,
        assignment_id: assignmentLoan.assignment_id
      },
      { transaction }
    );

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
          'code_employee',
          'name',
          'workplace',
          'identifier_document',
          'company',
          'department',
          'sub_management',
          'management_1',
          'management_2',
          'work_site',
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

  async upsertSchedule(
    schedule: ScheduleEntity,
    slot_id: string,
    transaction?: Transaction
  ): Promise<string> {
    const [scheduleDatabase] = await ScheduleModel.upsert(
      {
        ...schedule,
        id: schedule.id ? schedule.id : uuid(),
        slot_id: slot_id
      },
      { transaction }
    );

    return scheduleDatabase.getDataValue('id');
  }

  async employeeHasAnActiveAssignment(employeeId: string): Promise<boolean> {
    const [resultFunctionHasAssignment]: {
      [key: string]: boolean;
    }[] = await sequelize.query('select employee_has_an_active_assignment(?)', {
      replacements: [employeeId],
      type: QueryTypes.SELECT
    });

    return Object.values(resultFunctionHasAssignment)[0];
  }

  async canCreateMoreSchedulesInSlot(slotId: string): Promise<boolean> {
    const [resultFunctionCanCreateMoreSchedulesInSlot]: {
      [key: string]: boolean;
    }[] = await sequelize.query('select can_create_more_schedules_in_slot(?)', {
      replacements: [slotId],
      type: QueryTypes.SELECT
    });

    return Object.values(resultFunctionCanCreateMoreSchedulesInSlot)[0];
  }

  async updateAssignment() //assignment: AssignmentEntity,
  //vehicleIdsForDelete: string[]
  : Promise<void> {
    // const ownerData = assignment.employee;
    // const guestData = assignment.assignment_loan?.employee;
    // const vehiclesOwnerData = assignment.employee.vehicles;
    // const vehiclesGuestData = assignment.assignment_loan?.employee.vehicles;
    // const scheduleData = assignment.schedule;
    // const assignmentLoanData = assignment.assignment_loan;
    // const tags = assignment.tags;
    // const transaction = await sequelize.transaction();
    // if (vehicleIdsForDelete.length > 0) {
    //   await VehicleModel.destroy({
    //     where: {
    //       id: {
    //         [Op.in]: vehicleIdsForDelete
    //       },
    //       employee_id: {
    //         [Op.in]: [ownerData.id, guestData?.id]
    //       }
    //     },
    //     transaction
    //   });
    // }
    // //update vehicles owner
    // await this.upsertVehicles(vehiclesOwnerData, ownerData.id, transaction);
    // //update schedule
    // if (scheduleData.id) {
    //   await ScheduleModel.update(
    //     {
    //       start_time_assignment: scheduleData.start_time_assignment,
    //       end_time_assignment: scheduleData.end_time_assignment
    //     },
    //     {
    //       where: {
    //         id: scheduleData.id
    //       },
    //       transaction
    //     }
    //   );
    // }
    // if (guestData && vehiclesGuestData) {
    //   //Upsert vehicles guest
    //   await this.upsertVehicles(guestData.vehicles, guestData.id, transaction);
    // }
    // if (assignmentLoanData) {
    //   await AssignmentLoanModel.update(
    //     {
    //       start_date_assignment: assignmentLoanData.start_date_assignment,
    //       end_date_assignment: assignmentLoanData.end_date_assignment
    //     },
    //     {
    //       where: {
    //         assignment_id: assignment.id
    //       },
    //       transaction
    //     }
    //   );
    // }
    // if (tags.length > 0) {
    //   await AssignmentTagDetailModel.destroy({
    //     where: {
    //       assignment_id: assignment.id
    //     },
    //     transaction
    //   });
    //   await AssignmentTagDetailModel.bulkCreate(
    //     tags.map(tag => ({
    //       id: uuid(),
    //       assignment_id: assignment.id,
    //       tag_id: tag
    //     })),
    //     { transaction }
    //   );
    // }
    // await transaction.commit();
  }

  async getAssignmentLoanById(
    id: string
  ): Promise<AssignmentLoadEntity | null> {
    const assignmentLoan = await AssignmentLoanModel.findOne({
      where: { id, status: 'ACTIVO' },
      include: [{ model: EmployeeModel, as: 'employee' }]
    });
    return assignmentLoan?.get({ plain: true }) as AssignmentLoadEntity;
  }

  async getAssignmentLoanByIdAssignment(
    assignmentId: string
  ): Promise<AssignmentLoadEntity | null> {
    const assignmentLoan = await AssignmentLoanModel.findOne({
      where: { assignment_id: assignmentId },
      include: [{ model: EmployeeModel, as: 'employee' }]
    });
    return assignmentLoan?.get({ plain: true }) as AssignmentLoadEntity;
  }

  async updateStatusDiscountNote(id: string, status: string): Promise<void> {
    await DiscountNoteModel.update(
      { status_signature: status },
      { where: { id } }
    );
  }

  async deleteAssignmentLoan(assignmentLoanId: string): Promise<void> {
    await AssignmentLoanModel.update(
      { status: 'INACTIVO' },
      { where: { id: assignmentLoanId } }
    );
  }
}
