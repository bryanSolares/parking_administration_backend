import { NextFunction, Request, Response } from 'express';
import { GetTemplatesUseCase } from '../../application/template/get-templates';
import { GetVariablesUseCase } from '../../application/template/get-variables';

export class TemplateController {
  constructor(
    private readonly getTemplatesUseCase: GetTemplatesUseCase,
    private readonly getTemplateVariablesUseCase: GetVariablesUseCase
  ) {}

  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getTemplatesUseCase.run();
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTemplateVariables(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getTemplateVariablesUseCase.run();
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}
