import { EmployeeRepositoryWebService } from '@assignment-module-core/repositories/employee-repository';

import { EmployeeEntity } from '@assignment-module-core/entities/employee-entity';

import { SettingModel } from '@config/database/models/setting.model';

import { EmployeeModel } from '@config/database/models/employee.model';
import { VehicleModel } from '@config/database/models/vehicle.model';

export class WSEmployeeRepository implements EmployeeRepositoryWebService {
  async getEmployeeByCodefromWebService(
    codeEmployee: string
  ): Promise<EmployeeEntity | null> {
    let dataEmployeeWebService;

    const settingDatabase = await SettingModel.findOne({
      where: {
        setting_key: 'WS_EMPLOYEES'
      }
    });

    if (!settingDatabase) {
      throw new Error('Setting not found');
    }

    try {
      const response = await fetch(
        `${settingDatabase?.dataValues['setting_value']}/${codeEmployee}`
      );

      if (response.status >= 500) {
        throw new Error('Error on service');
      }

      if (response.status === 404) {
        throw new Error('Employee not found');
      }

      dataEmployeeWebService = await response.json();
    } catch (error) {
      throw new Error('Error on service');
    }

    if (!dataEmployeeWebService) {
      throw new Error('Employee not found');
    }

    const employee = new EmployeeEntity(
      dataEmployeeWebService.id,
      dataEmployeeWebService.username,
      dataEmployeeWebService.name,
      'workplace',
      'identifier_document',
      dataEmployeeWebService.company.name,
      'department',
      'sub_management',
      'management_1',
      'management_2',
      'work_site',
      dataEmployeeWebService.address.street,
      dataEmployeeWebService.email,
      dataEmployeeWebService.phone,
      '',
      '',
      []
    );

    return employee;
  }

  async getEmployeeByCodeFromDatabase(
    codeEmployee: string
  ): Promise<EmployeeEntity> {
    console.log(codeEmployee);

    const employeeDatabase = await EmployeeModel.findOne({
      where: {
        code_employee: codeEmployee
      },
      include: [
        {
          model: VehicleModel,
          attributes: {
            exclude: ['updated_at', 'created_at']
          }
        }
      ]
    });

    return employeeDatabase?.get({ plain: true }) as EmployeeEntity;
  }
}
