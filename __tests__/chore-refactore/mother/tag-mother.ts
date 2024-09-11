import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

import { TagEntity, TagStatus } from "../../src/parameters/core/entities/tag-entity";

export class TagMother{

  static createTag(): TagEntity{
    return new TagEntity(uuid(), faker.lorem.word(), faker.lorem.word(), TagStatus.ACTIVE);
  }
}
