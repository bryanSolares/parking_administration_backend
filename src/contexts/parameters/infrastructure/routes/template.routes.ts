import { Router } from 'express';
import { templateController } from '../repositories/dependencies';

const routes = Router();

routes.get('/', templateController.getTemplates.bind(templateController));
routes.get('/variables', templateController.getTemplateVariables.bind(templateController));

export default routes;
