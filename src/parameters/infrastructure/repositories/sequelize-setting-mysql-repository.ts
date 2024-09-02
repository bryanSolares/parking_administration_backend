import { SettingEntity } from '@src/parameters/core/entities/setting-entity';
import { SettingRepository } from '@src/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/parameters/core/repositories/setting-repository';
import { SettingModel } from '@src/server/config/database/models/setting.model';

export class SequelizeSettingMySQLRepository implements SettingRepository {
  async getParameterByKey(key: SettingKeys): Promise<SettingEntity | null> {
    const settingDatabase = await SettingModel.findOne({
      where: { setting_key: key }
    });

    if (!settingDatabase) {
      return null;
    }

    return SettingEntity.fromPrimitives(settingDatabase.get({ plain: true }));
  }
}
