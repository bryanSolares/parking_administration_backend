import { EmployeeEntity } from '@src/core/assignments/entities/employee-entity';
import { EmployeeRepositoryWebService } from '@src/core/assignments/repositories/employee-repository';

import { SettingModel } from '@src/server/config/database/models/setting.model';

import { WSError } from '@src/infrastructure/exceptions/WSError';
import { EmployeeModel } from '@src/server/config/database/models/employee.model';
import { VehicleModel } from '@src/server/config/database/models/vehicle.model';

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
        throw new WSError('Error on service');
      }

      if (response.status === 404) {
        throw new WSError('Employee not found');
      }

      dataEmployeeWebService = await response.json();
    } catch (error) {
      throw new WSError('Error on service');
    }

    if (!dataEmployeeWebService) {
      throw new WSError('Employee not found');
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
