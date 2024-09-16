import { AssignmentEntity } from "../../../src/assignment/core/entities/assignment-entity";
import { EmployeeEntity } from "../../../src/assignment/core/entities/employee-entity";
import { VehicleEntity } from "../../../src/assignment/core/entities/vehicle-entity";
import { AssignmentModel } from '../../../src/server/config/database/models/assignment.model';
import { EmployeeModel } from '../../../src/server/config/database/models/employee.model';
import { VehicleModel } from '../../../src/server/config/database/models/vehicle.model';

interface AssignmentTableResult {
  id: string;
  slotId: number;
  employeeId: number;
  parkingCardNumber: string;
  benefitType: string;
  assignmentDate: Date;
  formDecisionDate: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface EmployeeTableResult {

  id: string;
  employeeCode: string;
  name: string;
  workplace: string;
  identifierDocument: string;
  company: string;
  department: string;
  subManagement: string;
  management1: string;
  management2: string;
  workSite: string;
  address: string;
  email: string;
  phone: string;
  accessToken: string;
  accessTokenStatus: string;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleTableResult {
  id: string;
  vehicleBadge: string;
  color: string;
  brand: string;
  model: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}


export class AssignmentHelper {
  static async getAllAssignments(): Promise<AssignmentTableResult[]> {
    const assignmentsDatabase = await AssignmentModel.findAll();
    return assignmentsDatabase.map(assignment => ({...assignment.get({ plain: true })}));
  }

  static async getAllEmployees(): Promise<EmployeeTableResult[]> {
    const employeesDatabase = await EmployeeModel.findAll();
    return employeesDatabase.map(employee => ({...employee.get({ plain: true })}));
  }

  static async getAllVehicles(): Promise<VehicleTableResult[]> {
    const vehiclesDatabase = await VehicleModel.findAll();
    return vehiclesDatabase.map(vehicle => ({...vehicle.get({ plain: true })}));
  }
}
