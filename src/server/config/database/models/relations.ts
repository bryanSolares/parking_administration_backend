import { AssignmentModel } from './assignment.model';
import { EmployeeModel } from './employee.model';
import { LocationModel } from './location.model';
import { ScheduleModel } from './schedule.model';
import { SlotModel } from './slot.model';
import { VehicleModel } from './vehicle.model';
import { AssignmentLoanModel } from './assignment-loan';

LocationModel.hasMany(SlotModel, {
  foreignKey: 'location_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
SlotModel.belongsTo(LocationModel, { foreignKey: 'location_id' });

EmployeeModel.hasOne(AssignmentModel, {
  foreignKey: 'employee_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

SlotModel.hasOne(AssignmentModel, {
  foreignKey: 'slot_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentModel.belongsTo(SlotModel, { foreignKey: 'slot_id' });

ScheduleModel.hasOne(AssignmentModel, {
  foreignKey: 'schedule_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentModel.belongsTo(ScheduleModel, { foreignKey: 'schedule_id' });

AssignmentModel.hasOne(AssignmentLoanModel, {
  foreignKey: 'assignment_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentLoanModel.belongsTo(AssignmentModel, { foreignKey: 'assignment_id' });

EmployeeModel.hasOne(AssignmentLoanModel, {
  foreignKey: 'employee_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentLoanModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

EmployeeModel.hasMany(VehicleModel, {
  foreignKey: 'employee_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
VehicleModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

SlotModel.hasMany(ScheduleModel, {
  foreignKey: 'slot_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
ScheduleModel.belongsTo(SlotModel, { foreignKey: 'slot_id' });
