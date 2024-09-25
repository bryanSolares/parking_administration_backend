import { EmailTemplateEntity } from '../entities/email-template';
import { TemplateParameterEntity } from '../entities/template-parameter';

export interface TemplateRepository {
  // updateTemplate(template: EmailTemplateEntity): Promise<void>;
  // getTemplateById(id: string): Promise<EmailTemplateEntity>;
  getTemplates(): Promise<Array<EmailTemplateEntity>>;
  getTemplateVariables(): Promise<Array<TemplateParameterEntity>>;
}
