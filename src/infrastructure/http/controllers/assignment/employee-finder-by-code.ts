import { Request, Response } from 'express';

import { GetEmployeeByCode } from '@src/application/assignments/get-employee-by-code';

export class EmployeeFinderByCode {
  constructor(private readonly GetEmployeeByCode: GetEmployeeByCode) {}

  async run(req: Request, res: Response) {
    const code = req.params.code;

    try {
      const employee = await this.GetEmployeeByCode.run(code);
      const response = {
        data: employee
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
