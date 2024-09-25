export enum TemplateType {
  ASSIGNMENT = 'ASSIGNMENT',
  DISCOUNT_NOTE = 'DISCOUNT_NOTE',
  DE_ASSIGNMENT = 'DE_ASSIGNMENT',
  ASSIGNMENT_LOAN = 'ASSIGNMENT_LOAN'
}

export class EmailTemplateEntity {
  constructor(
    readonly id: string,
    readonly type: TemplateType,
    readonly templateName: string,
    readonly subject: string,
    readonly content: string
  ) {}

  static fromPrimitive(data: {
    id: string;
    type: TemplateType;
    templateName: string;
    subject: string;
    content: string;
  }): EmailTemplateEntity {
    return new EmailTemplateEntity(data.id, data.type, data.templateName, data.subject, data.content);
  }

  toPrimitive() {
    return {
      id: this.id,
      type: this.type,
      templateName: this.templateName,
      subject: this.subject,
      content: this.content
    };
  }
}
