import { EmployeeEntity } from '@src/core/assignments/entities/employee-entity';
import { EmployeeRepository } from '@src/core/assignments/repositories/employee-repository';

export class GetEmployeeByCode {
  constructor(private employeeRepository: EmployeeRepository) {}

  async run(codeEmployee: string): Promise<EmployeeEntity> {
    const employee =
      await this.employeeRepository.getEmployeeByCode(codeEmployee);

    // TODO: change to throw
    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }
}
