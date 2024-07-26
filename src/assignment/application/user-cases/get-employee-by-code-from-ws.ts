import { EmployeeRepositoryWebService } from '@assignment-module-core/repositories/employee-repository';
import { EmployeeEntity } from '@assignment-module-core/entities/employee-entity';
import { EmployeeNotFoundError } from '@assignment-module-core/exceptions/employee-not-found';

export class GetEmployeeByCode {
  constructor(private employeeRepository: EmployeeRepositoryWebService) {}

  async run(codeEmployee: string): Promise<EmployeeEntity | null> {
    const employeeWebService =
      await this.employeeRepository.getEmployeeByCodefromWebService(
        codeEmployee
      );

    const employeeDatabase =
      await this.employeeRepository.getEmployeeByCodeFromDatabase(codeEmployee);

    if (!employeeWebService) {
      throw new EmployeeNotFoundError('Employee not found');
    }

    if (employeeDatabase) {
      employeeWebService.id = employeeDatabase.id;
      employeeWebService.vehicles = employeeDatabase.vehicles;
      employeeWebService.access_token = employeeDatabase.access_token;
      employeeWebService.access_token_status =
        employeeDatabase.access_token_status;
    }

    return employeeWebService;
  }
}
