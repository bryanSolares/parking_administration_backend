import { EmployeeEntity } from '../entities/employee-entity';

export interface EmployeeRepository {
  getEmployeeFromWebService(
    employeeCode: string,
    url: string
  ): Promise<Response>;

  getEmployeeFromDatabase(employeeCode: string): Promise<EmployeeEntity | null>;
}
