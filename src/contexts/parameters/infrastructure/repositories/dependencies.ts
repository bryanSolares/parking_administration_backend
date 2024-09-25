import { SequelizePostgresRepository } from './sequelize-postgres-repository';
import { SequelizeSettingMySQLRepository } from '../repositories/sequelize-setting-mysql-repository';
import { SequelizeMySqlTemplateRepository } from '../repositories/sequelize-mysql-template-repository';

import { TagController } from '../controllers/tag.controller';
import { SettingController } from '../controllers/setting.controller';
import { TemplateController } from '../controllers/template.controller';

import { CreateTag } from '@src/contexts/parameters/application/use-cases/create-tag';
import { UpdateTag } from '@src/contexts/parameters/application/use-cases/update-tag';
import { DeleteTag } from '@src/contexts/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '@src/contexts/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '@src/contexts/parameters/application/use-cases/tag-finder';

import { GetAllSettingsUseCase } from '../../application/setting/get-all-settings';
import { UpdateSettingUseCase } from '../../application/setting/update-setting';
import { GetByIdSettingUseCase } from '../../application/setting/get-by-id-setting';

import { GetTemplatesUseCase } from '@src/contexts/parameters/application/template/get-templates';
import { GetVariablesUseCase } from '@src/contexts/parameters/application/template/get-variables';

const repository = new SequelizePostgresRepository();
const settingRepository = new SequelizeSettingMySQLRepository();
const templateRepository = new SequelizeMySqlTemplateRepository();

const createTagUseCase = new CreateTag(repository);
const updateTagUseCase = new UpdateTag(repository);
const deleteTagUseCase = new DeleteTag(repository);
const tagFinderByIdUseCase = new TagFinderById(repository);
const tagFinderUseCase = new TagFinder(repository);

const getAllSettingsUseCase = new GetAllSettingsUseCase(settingRepository);
const updateSettingUseCase = new UpdateSettingUseCase(settingRepository);
const getByIdSettingUseCase = new GetByIdSettingUseCase(settingRepository);

const getTemplatesUseCase = new GetTemplatesUseCase(templateRepository);
const getTemplateVariablesUseCase = new GetVariablesUseCase(templateRepository);

const tagController = new TagController(
  createTagUseCase,
  updateTagUseCase,
  deleteTagUseCase,
  tagFinderByIdUseCase,
  tagFinderUseCase
);

const settingController = new SettingController(getAllSettingsUseCase, updateSettingUseCase, getByIdSettingUseCase);

const templateController = new TemplateController(getTemplatesUseCase, getTemplateVariablesUseCase);

export { tagController, settingController, templateController };
