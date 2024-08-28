import { EmployeeEntity } from '../entities/employee-entity';

export interface EmployeeRepository {
  getEmployeeByCodefromWebService(
    codeEmployee: string
  ): Promise<EmployeeEntity | null>;

  getEmployeeByCodeFromDatabase(
    codeEmployee: string
  ): Promise<EmployeeEntity | null>;
}
