import { ResourceEntity } from './resource-entity';

export type RoleStatus = 'ACTIVO' | 'INACTIVO';
type Resource = Pick<ResourceEntity, 'id' | 'slug' | 'description'> & {
  can_access: boolean;
};

export class RoleEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: RoleStatus;
  resources: Resource[];

  constructor(
    id: string,
    name: string,
    description: string,
    status: RoleStatus,
    resources: Resource[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.resources = resources;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
    status: RoleStatus;
    resources: Resource[];
  }): RoleEntity {
    const resources = plainData.resources.map(resource => {
      return {
        id: resource.id,
        slug: resource.slug,
        description: resource.description,
        can_access: resource.can_access
      };
    });

    return new RoleEntity(
      plainData.id,
      plainData.name,
      plainData.description,
      plainData.status,
      resources
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      resources: this.resources
    };
  }
}
