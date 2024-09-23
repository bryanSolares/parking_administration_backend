import { Router } from 'express';
import { settingController } from '../repositories/dependencies';

import { idSettingSchema, settingUpdateSchema } from '../utils/setting-zod-schema';

import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .get('/', settingController.getAll.bind(settingController))
  .get('/:setting_id', validateRequest(idSettingSchema, 'params'), settingController.getById.bind(settingController))
  .patch(
    '/:setting_id',
    validateRequest(settingUpdateSchema, 'body'),
    validateRequest(idSettingSchema, 'params'),
    settingController.update.bind(settingController)
  );

export default routes;
