import { AppError } from '@src/server/config/err/AppError';
import { EmployeeRepository } from '../../core/repositories/employee-repository';
import { EmployeeEntity } from '@src/assignment/core/entities/employee-entity';
import { SettingRepository } from '@src/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/parameters/core/repositories/setting-repository';

export class GetEmployeeByCode {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly settingRepository: SettingRepository
  ) {}

  async run(employeeCode: string): Promise<EmployeeEntity> {
    const settingWebService = await this.settingRepository.getParameterByKey(SettingKeys.WS_EMPLOYEES);

    if (!settingWebService) {
      throw new AppError('SETTING_NOT_FOUND', 404, 'Employee web service configuration not found', true);
    }

    let response: Response = new Response();
    try {
      response = await this.employeeRepository.getEmployeeFromWebService(employeeCode, settingWebService.settingValue);
    } catch (error) {
      throw new AppError('ERROR_ON_SERVICE', 503, 'Employee web service does not working', true);
    }

    if (response.status === 500) {
      throw new AppError('ERROR_ON_SERVICE', 503, 'Employee web service is not available', true);
    }

    if (response.status === 404) {
      throw new AppError('EMPLOYEE_NOT_FOUND', 404, 'Employee not found', true);
    }

    const data = await response.json();

    const employee = EmployeeEntity.fromPrimitive(data);

    const employeeDatabase = await this.employeeRepository.getEmployeeFromDatabase(employeeCode);

    if (employeeDatabase) {
      employee.id = employeeDatabase.id;
      employee.vehicles = employeeDatabase.vehicles;
      employee.accessToken = employeeDatabase.accessToken;
      employee.accessTokenStatus = employeeDatabase.accessTokenStatus;
    }

    return employee;
  }
}
