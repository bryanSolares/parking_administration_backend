import { sequelize } from '@config/database/sequelize';
import { QueryTypes } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { AssignmentEntity } from '@src/core/assignments/entities/assignment-entity';
import { AssignmentRepository } from '@src/core/assignments/repositories/assignment-repository';

import { AssignmentModel } from '@config/database/models/assignment.model';
import { EmployeeModel } from '@config/database/models/employee.model';
import { VehicleModel } from '@config/database/models/vehicle.model';
import { ScheduleModel } from '@src/server/config/database/models/schedule.model';
import { SlotModel } from '@src/server/config/database/models/slot.model';
import { LocationModel } from '@src/server/config/database/models/location.model';
import { DeAssignmentEntity } from '@src/core/assignments/entities/deassignment-entity';
import { DeAssignmentModel } from '@src/server/config/database/models/de-assignment.model';
import { DiscountNoteModel } from '@src/server/config/database/models/discount-note.model';
import { DiscountNoteEntity } from '@src/core/assignments/entities/discount-note-entity';

export class SequelizeAssignmentRepository implements AssignmentRepository {
  async getDiscountNoteByIdAssignment(
    id: string
  ): Promise<DiscountNoteEntity | null> {
    const discountNote = await DiscountNoteModel.findOne({
      where: { assignment_id: id }
    });

    return discountNote as unknown as DiscountNoteEntity;
  }

  async createDiscountNote(idAssignment: string): Promise<void> {
    await DiscountNoteModel.create(
      {
        id: uuid(),
        assignment_id: idAssignment
      },
      { fields: ['id', 'assignment_id'] }
    );
  }

  async deAssignmentById(
    assignmentId: string,
    deAssignment: DeAssignmentEntity
  ): Promise<void> {
    const transaction = await sequelize.transaction();
    await AssignmentModel.update(
      { status: 'INACTIVO' },
      { where: { id: assignmentId }, transaction }
    );

    await DeAssignmentModel.create(
      { ...deAssignment, id: uuid(), assignment_id: assignmentId },
      { transaction }
    );

    await transaction.commit();
  }

  async getAssignments(): Promise<AssignmentEntity[] | null> {
    const assignments = await AssignmentModel.findAll({
      attributes: {
        exclude: [
          'slot_id',
          'schedule_id',
          'employee_id',
          'created_at',
          'updated_at'
        ]
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
        }
      ]
    });
    return assignments as unknown as AssignmentEntity[];
  }

  async getAssignmentById(id: string): Promise<AssignmentEntity | null> {
    const listExcludedAtributes = ['created_at', 'updated_at'];

    const assignment = await AssignmentModel.findOne({
      where: { id },
      include: [
        {
          model: EmployeeModel,
          attributes: {
            exclude: listExcludedAtributes
          },
          include: [
            {
              model: VehicleModel,
              attributes: {
                exclude: [...listExcludedAtributes, 'employee_id']
              }
            }
          ]
        },
        {
          model: SlotModel,
          attributes: {
            exclude: [...listExcludedAtributes, 'location_id']
          },
          include: [
            {
              model: LocationModel,
              attributes: {
                exclude: listExcludedAtributes
              }
            }
          ]
        },
        {
          model: ScheduleModel,
          attributes: { exclude: [...listExcludedAtributes, 'slot_id'] }
        }
      ],
      attributes: ['id', 'assignment_date', 'status']
    });

    return assignment as unknown as AssignmentEntity;
  }

  async createAssignment(assignment: AssignmentEntity): Promise<void> {
    // Validate prev assignment how to guest

    const employee = assignment.employee;
    const vehicles = assignment.employee.vehicles;
    const schedule = assignment.schedule;
    let newSchedule;

    const transaction = await sequelize.transaction();

    //Save employee
    const [employeeDatabase] = await EmployeeModel.upsert(
      {
        ...employee,
        id: employee.id ? employee.id : uuid(),
        employee_id: employee.id
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

    //Save vehicles
    await Promise.all(
      vehicles.map(async vehicle => {
        await VehicleModel.upsert(
          {
            ...vehicle,
            id: vehicle.id ? vehicle.id : uuid(),
            employee_id: employeeDatabase.getDataValue('id')
          },
          { transaction }
        );
      })
    );

    //Save Schedule
    if (schedule) {
      [newSchedule] = await ScheduleModel.upsert(
        {
          ...schedule,
          id: schedule.id ? schedule.id : uuid(),
          slot_id: assignment.slot_id
        },
        { transaction }
      );
    }

    //Save assignment
    await AssignmentModel.create(
      {
        ...assignment,
        id: uuid(),
        slot_id: assignment.slot_id,
        employee_id: employeeDatabase.getDataValue('id'),
        schedule_id: newSchedule?.getDataValue('id')
      },
      { transaction }
    );

    await transaction.commit();
  }

  async employeeHasAnActiveAssignment(employeeId: string): Promise<boolean> {
    const [resultFunctionHasAssignment]: {
      employee_has_an_active_assignment: boolean;
    }[] = await sequelize.query('select employee_has_an_active_assignment(?)', {
      replacements: [employeeId],
      type: QueryTypes.SELECT
    });

    return resultFunctionHasAssignment.employee_has_an_active_assignment;
  }

  async isAValidSlot(slotId: string): Promise<boolean> {
    const [resultQueryFindByIdSlot] = await sequelize.query(
      'select 1 from slot where id = ?',
      {
        replacements: [slotId],
        type: QueryTypes.SELECT
      }
    );

    return Boolean(resultQueryFindByIdSlot);
  }

  async canCreateMoreSchedulesInSlot(slotId: string): Promise<boolean> {
    const [resultFunctionCanCreateMoreSchedulesInSlot]: {
      can_create_more_schedules_in_slot: boolean;
    }[] = await sequelize.query('select can_create_more_schedules_in_slot(?)', {
      replacements: [slotId],
      type: QueryTypes.SELECT
    });

    return resultFunctionCanCreateMoreSchedulesInSlot.can_create_more_schedules_in_slot;
  }
}
