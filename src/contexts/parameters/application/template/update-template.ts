import { TemplateRepository } from '../../core/repositories/template-repository';

export class UpdateTemplateUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  // async run(id: string, data: any) {
  //   await this.templateRepository.updateTemplate(data);
  // }
}
