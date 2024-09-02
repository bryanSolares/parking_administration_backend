export enum TagStatus {
  'ACTIVE' = 'ACTIVO',
  'INACTIVE' = 'INACTIVO'
}

export class TagEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: TagStatus;

  constructor(
    id: string,
    name: string,
    description: string,
    status: TagStatus
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
    status: TagStatus;
  }) {
    return new TagEntity(
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
