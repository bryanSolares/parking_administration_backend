import { AssignmentModel } from './assignment/assignment.model';
import { EmployeeModel } from './assignment/employee.model';
import { LocationModel } from './parking/location.model';
import { SlotModel } from './parking/slot.model';
import { VehicleModel } from './assignment/vehicle.model';
import { TagModel } from './parameter/tag.model';
import { AssignmentTagDetailModel } from './assignment/assignment-tag-detail';
import { DiscountNoteModel } from './assignment/discount-note.model';
import { AssignmentLoanModel } from './assignment/assignment-loan';
import { DeAssignmentModel } from './assignment/de-assignment.model';

import { RoleModel } from './auth/role.model';
import { RoleDetailModel } from './auth/role.detail.model';
import { ResourceModel } from './auth/resource.model';
import { UserModel } from './auth/user.model';
import { NotificationPreferenceModel } from './parameter/notification-preference';
import { NotificationTypeModel } from './parameter/notification-type';

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

TagModel.belongsToMany(AssignmentModel, {
  through: AssignmentTagDetailModel
});

AssignmentModel.belongsToMany(TagModel, { through: AssignmentTagDetailModel });

AssignmentModel.hasOne(DiscountNoteModel, {
  foreignKey: 'assignment_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
DiscountNoteModel.belongsTo(AssignmentModel, {
  foreignKey: 'assignment_id'
});

DeAssignmentModel.belongsTo(AssignmentModel, {
  foreignKey: 'assignment_id'
});
AssignmentModel.hasOne(DeAssignmentModel, {
  foreignKey: 'assignment_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});

RoleModel.belongsToMany(ResourceModel, {
  through: RoleDetailModel,
  foreignKey: 'role_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

ResourceModel.belongsToMany(RoleModel, {
  through: RoleDetailModel,
  foreignKey: 'resource_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

RoleModel.hasMany(UserModel, {
  foreignKey: 'role_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });

/*******Notification Preferences *******/
NotificationTypeModel.hasMany(NotificationPreferenceModel, { foreignKey: 'notificationType' });
UserModel.hasMany(NotificationPreferenceModel, { foreignKey: 'userId' });
NotificationPreferenceModel.belongsTo(UserModel, { foreignKey: 'userId' });
NotificationPreferenceModel.belongsTo(NotificationTypeModel, { foreignKey: 'notificationType' });
