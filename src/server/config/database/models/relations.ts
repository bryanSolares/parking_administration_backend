import { LocationModel } from './location.model';
import { SlotModel } from './slot.model';

LocationModel.hasMany(SlotModel, { foreignKey: 'location_id' });
SlotModel.belongsTo(LocationModel, { foreignKey: 'location_id' });
