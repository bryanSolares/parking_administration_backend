import { SettingEntity } from '../entities/setting-entity';

export enum SettingKeys {
  WS_EMPLOYEES = 'WS_EMPLOYEES'
}

export interface SettingRepository {
  getParameterByKey(key: SettingKeys): Promise<SettingEntity | null>;
}
