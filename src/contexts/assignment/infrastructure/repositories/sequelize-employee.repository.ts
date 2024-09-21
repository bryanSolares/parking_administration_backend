import { URL } from 'node:url';
import { EmployeeRepository } from '@src/contexts/assignment/core/repositories/employee-repository';

import { EmployeeEntity } from '@src/contexts/assignment/core/entities/employee-entity';

import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';
import { VehicleModel } from '@src/contexts/shared/infrastructure/models/assignment/vehicle.model';

export class SequelizeEmployeeRepository implements EmployeeRepository {
  async getEmployeeFromWebService(codeEmployee: string, url: string): Promise<Response> {
    const urlWebService = new URL(`${url}/${codeEmployee}`);
    const response = await fetch(urlWebService.href);
    return response;
  }

  async getEmployeeFromDatabase(codeEmployee: string): Promise<EmployeeEntity | null> {
    const employeeDatabase = await EmployeeModel.findOne({
      where: {
        employee_code: codeEmployee
      },
      include: [
        {
          model: VehicleModel
        }
      ]
    });

    if (!employeeDatabase) return null;

    return EmployeeEntity.fromPrimitive(employeeDatabase.get({ plain: true }));
  }

  async getEmployeeByIdFromDatabase(employeeId: string): Promise<EmployeeEntity | null> {
    const employeeDatabase = await EmployeeModel.findByPk(employeeId, {
      include: [
        {
          model: VehicleModel
        }
      ]
    });

    if (!employeeDatabase) return null;

    return EmployeeEntity.fromPrimitive(employeeDatabase.get({ plain: true }));
  }
}
