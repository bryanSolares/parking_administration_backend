import { TemplateEmailModel } from '@src/contexts/shared/infrastructure/models/parameter/template-email.model';
import { EmailTemplateEntity } from '../../core/entities/email-template';
import { TemplateVariableEntity } from '../../core/entities/template-variable';
import { TemplateRepository } from '../../core/repositories/template-repository';
import { TemplateVariableModel } from '@src/contexts/shared/infrastructure/models/parameter/template-variable.model';

export class SequelizeMySqlTemplateRepository implements TemplateRepository {
  // updateTemplate(template: EmailTemplateEntity): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }
  // getTemplateById(id: string): Promise<EmailTemplateEntity> {
  //   throw new Error('Method not implemented.');
  // }
  async getTemplates(): Promise<Array<EmailTemplateEntity>> {
    const templates = await TemplateEmailModel.findAll();
    return templates.map(template => EmailTemplateEntity.fromPrimitive({ ...template.get({ plain: true }) }));
  }
  async getTemplateVariables(): Promise<Array<TemplateVariableEntity>> {
    const variables = await TemplateVariableModel.findAll();
    return variables.map(variable => TemplateVariableEntity.fromPrimitive({ ...variable.get({ plain: true }) }));
  }
}
