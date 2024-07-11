import { AssignmentModel } from './assignment.model';
import { EmployeeModel } from './employee.model';
import { LocationModel } from './location.model';
import { ScheduleModel } from './schedule.model';
import { SlotModel } from './slot.model';
import { VehicleModel } from './vehicle.model';

LocationModel.hasMany(SlotModel, { foreignKey: 'location_id' });
SlotModel.belongsTo(LocationModel, { foreignKey: 'location_id' });

EmployeeModel.hasOne(AssignmentModel, { foreignKey: 'employee_id' });
AssignmentModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

SlotModel.hasOne(AssignmentModel, { foreignKey: 'slot_id' });
AssignmentModel.belongsTo(SlotModel, { foreignKey: 'slot_id' });

ScheduleModel.hasOne(AssignmentModel, { foreignKey: 'schedule_id' });
AssignmentModel.belongsTo(ScheduleModel, { foreignKey: 'schedule_id' });

EmployeeModel.hasMany(VehicleModel, { foreignKey: 'employee_id' });
VehicleModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

SlotModel.hasMany(ScheduleModel, { foreignKey: 'slot_id' });
ScheduleModel.belongsTo(SlotModel, { foreignKey: 'slot_id' });
