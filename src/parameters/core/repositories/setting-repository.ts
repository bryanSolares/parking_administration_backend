import { SettingEntity } from '../entities/setting-entity';

export enum SettingKeys {
  WS_EMPLOYEES = 'WS_EMPLOYEES',
  SIGNATURES_FOR_ACCEPTANCE_FORM = 'SIGNATURES_FOR_ACCEPTANCE_FORM'
}

export interface SettingRepository {
  getParameterByKey(key: SettingKeys): Promise<SettingEntity | null>;
}
