import { AssignmentModel } from './assignment.model';
import { EmployeeModel } from './employee.model';
import { LocationModel } from './location.model';
import { ScheduleModel } from './schedule.model';
import { SlotModel } from './slot.model';
import { VehicleModel } from './vehicle.model';

LocationModel.hasMany(SlotModel, { foreignKey: 'location_id' });
SlotModel.belongsTo(LocationModel, { foreignKey: 'location_id' });

EmployeeModel.hasMany(SlotModel, { foreignKey: 'employee_id' });
VehicleModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

AssignmentModel.hasOne(EmployeeModel, { foreignKey: 'employee_id' });
AssignmentModel.hasOne(SlotModel, { foreignKey: 'slot_id' });
AssignmentModel.hasOne(ScheduleModel, { foreignKey: 'schedule_id' });

SlotModel.hasMany(ScheduleModel, { foreignKey: 'slot_id' });
ScheduleModel.belongsTo(SlotModel, { foreignKey: 'slot_id' });
