import { URL } from 'node:url';
import { EmployeeRepository } from '@assignment-module-core/repositories/employee-repository';

import { EmployeeEntity } from '@assignment-module-core/entities/employee-entity';

import { EmployeeModel } from '@config/database/models/employee.model';
import { VehicleModel } from '@config/database/models/vehicle.model';

export class SequelizeEmployeeRepository implements EmployeeRepository {
  async getEmployeeFromWebService(
    codeEmployee: string,
    url: string
  ): Promise<Response> {
    const urlWebService = new URL(`${url}/${codeEmployee}`);
    const response = await fetch(urlWebService.href);
    return response;
  }

  async getEmployeeFromDatabase(
    codeEmployee: string
  ): Promise<EmployeeEntity | null> {
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

  async getEmployeeByIdFromDatabase(
    employeeId: string
  ): Promise<EmployeeEntity | null> {
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
