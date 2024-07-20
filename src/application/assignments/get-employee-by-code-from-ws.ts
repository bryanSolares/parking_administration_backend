import { EmployeeEntity } from '@src/core/assignments/entities/employee-entity';
import { EmployeeNotFoundError } from '@src/core/assignments/exceptions/employee-not-found';
import { EmployeeRepositoryWebService } from '@src/core/assignments/repositories/employee-repository';

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
