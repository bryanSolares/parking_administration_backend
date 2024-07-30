export class TagEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: 'ACTIVO' | 'INACTIVO';

  constructor(
    id: string,
    name: string,
    description: string,
    status: 'ACTIVO' | 'INACTIVO'
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
    status: 'ACTIVO' | 'INACTIVO';
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
