export class SettingEntity {
  constructor(
    public readonly id: string,
    public readonly settingKey: string,
    public readonly settingValue: string,
    public readonly description: string
  ) {}

  static fromPrimitives(plainData: {
    id: string;
    settingKey: string;
    settingValue: string;
    description: string;
  }) {
    return new SettingEntity(
      plainData.id,
      plainData.settingKey,
      plainData.settingValue,
      plainData.description
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      settingKey: this.settingKey,
      settingValue: this.settingValue,
      description: this.description
    };
  }
}
