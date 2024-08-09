import { faker } from "@faker-js/faker";
import { RoleEntity } from "../../src/auth/domain/entities/role-entity";
import { RoleStatus } from "../../src/auth/domain/entities/role-entity";

export class RoleMother{
  static createRole({
    id = faker.string.uuid(),
    name = faker.person.fullName(),
    description = faker.lorem.sentence(),
    status = "ACTIVO" as RoleStatus,
  }): RoleEntity {
    return new RoleEntity(id, name, description, status,);
  }
}
