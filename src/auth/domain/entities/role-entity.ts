export type RoleStatus = 'ACTIVO' | 'INACTIVO';

export class RoleEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: RoleStatus;

  constructor(
    id: string,
    name: string,
    description: string,
    status: RoleStatus
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
    status: RoleStatus;
  }): RoleEntity {
    return new RoleEntity(
      plainData.id,
      plainData.name,
      plainData.description,
      plainData.status
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status
    };
  }
}
