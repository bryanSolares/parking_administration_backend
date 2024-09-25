import { TemplateEmailModel } from '@src/contexts/shared/infrastructure/models/parameter/template-email.model';
import { EmailTemplateEntity } from '../../core/entities/email-template';
import { TemplateParameterEntity } from '../../core/entities/template-parameter';
import { TemplateRepository } from '../../core/repositories/template-repository';
import { TemplateParameterModel } from '@src/contexts/shared/infrastructure/models/parameter/template-parameter.model';

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
  async getTemplateVariables(): Promise<Array<TemplateParameterEntity>> {
    const variables = await TemplateParameterModel.findAll();
    return variables.map(variable => TemplateParameterEntity.fromPrimitive({ ...variable.get({ plain: true }) }));
  }
}
