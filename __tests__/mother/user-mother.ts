import { faker } from "@faker-js/faker";
import { UserEntity } from "../../src/auth/domain/entities/user-entity";
import { UserStatus } from "../../src/auth/domain/entities/user-entity";

export class UserMother{
  static createUser({
    id = faker.string.uuid(),
    name = faker.person.fullName(),
    email = faker.internet.email(),
    username = faker.internet.userName(),
    password = faker.internet.password(),
    status = "ACTIVO" as UserStatus,
    phone = faker.phone.number(),
    role= ""
  }): UserEntity {
    return new UserEntity(id, name, email, username, password, status, phone, role);
  }
}
