import { EmployeeEntity } from '@src/core/assignments/entities/employee-entity';
import { EmployeeRepository } from '@src/core/assignments/repositories/employee-repository';

import { SettingModel } from '@src/server/config/database/models/setting.model';

import { logger } from '@config/logger/load-logger';
import { WSError } from '@src/infrastructure/exceptions/WSError';

export class WSEmployeeRepository implements EmployeeRepository {
  async getEmployeeByCode(codeEmployee: string): Promise<EmployeeEntity> {
    logger().info(`Fetching employee by code: ${codeEmployee}`);
    let data;

    // Searcht link on database
    // TODO: redis integration

    const setting = await SettingModel.findOne({
      where: {
        setting_key: 'WS_EMPLOYEES'
      }
    });

    // TODO: Altevative database if fetch not work
    try {
      const response = await fetch(
        `${setting?.dataValues['setting_value']}/${codeEmployee}`
      );

      // TODO: improve error handling

      if (response.status >= 500) {
        logger().warn(`Error on service: ${response.status}`);
        throw new WSError('Error on service');
      }

      if (response.status === 404) {
        logger().warn(`Employee not found: ${codeEmployee}`);
        throw new WSError('Employee not found');
      }

      data = await response.json();
    } catch (error) {
      logger().error(error);
      throw error;
    }

    if (!data) {
      console.log('sencod');
      logger().warn(`Employee not found: ${codeEmployee}`);
      throw new WSError('Employee not found');
    }

    //TODO: DATABASE: validate assignment exists with function

    const employee = new EmployeeEntity(
      data.id,
      data.username,
      data.name,
      'workplace',
      'identifier_document',
      data.company.name,
      'department',
      'sub_management',
      'management_1',
      'management_2',
      'work_site',
      data.address.street,
      data.email,
      data.phone,
      '',
      ''
    );

    return employee;
  }
}
