import { EmailTemplateEntity } from '../entities/email-template';
import { TemplateVariableEntity } from '../entities/template-variable';

export interface TemplateRepository {
  // updateTemplate(template: EmailTemplateEntity): Promise<void>;
  // getTemplateById(id: string): Promise<EmailTemplateEntity>;
  getTemplates(): Promise<Array<EmailTemplateEntity>>;
  getTemplateVariables(): Promise<Array<TemplateVariableEntity>>;
}
