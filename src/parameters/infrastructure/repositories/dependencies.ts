import { SequelizePostgresRepository } from './sequelize-postgres-repository';

import { CreateTag } from '@src/parameters/application/use-cases/create-tag';
import { UpdateTag } from '@src/parameters/application/use-cases/update-tag';
import { DeleteTag } from '@src/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '@src/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '@src/parameters/application/use-cases/tag-finder';

import { TagController } from '../controllers/tag.controller';

const repository = new SequelizePostgresRepository();

const createTagUseCase = new CreateTag(repository);
const updateTagUseCase = new UpdateTag(repository);
const deleteTagUseCase = new DeleteTag(repository);
const tagFinderByIdUseCase = new TagFinderById(repository);
const tagFinderUseCase = new TagFinder(repository);

const tagController = new TagController(
  createTagUseCase,
  updateTagUseCase,
  deleteTagUseCase,
  tagFinderByIdUseCase,
  tagFinderUseCase
);

export { tagController };
