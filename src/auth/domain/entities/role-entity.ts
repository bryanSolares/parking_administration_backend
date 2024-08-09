export type RoleStatus = 'ACTIVO' | 'INACTIVO';

export class RoleEntity {
  readonly name: string;
  readonly description: string;
  readonly status: RoleStatus;
  readonly listAccess: Map<string, boolean>;
  readonly id: string;

  constructor(
    name: string,
    description: string,
    status: RoleStatus,
    listAccess: Map<string, boolean>,
    id: string
  ) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.listAccess = listAccess;
    this.id = id;
  }

  static fromPrimitives(plainData: {
    name: string;
    description: string;
    status: RoleStatus;
    listAccess: Map<string, boolean>;
    id: string;
  }): RoleEntity {
    return new RoleEntity(
      plainData.name,
      plainData.description,
      plainData.status,
      plainData.listAccess,
      plainData.id
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      listAccess: this.listAccess
    };
  }
}
