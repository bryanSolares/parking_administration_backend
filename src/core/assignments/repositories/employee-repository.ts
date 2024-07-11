import { EmployeeEntity } from '../entities/employee-entity';

export interface EmployeeRepository {
  getEmployeeByCode(codeEmployee: string): Promise<EmployeeEntity | null>;
}
