import { Request, Response } from 'express';

import { CreateRole } from '@src/auth/application/use-cases/role/create-role';
import { UpdateRole } from '@src/auth/application/use-cases/role/update-role';
import { DeleteRole } from '@src/auth/application/use-cases/role/delete-role';
import { FinderById } from '@src/auth/application/use-cases/role/finder-by-id-role';
import { FinderRole } from '@src/auth/application/use-cases/role/finder-role';

export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRole,
    private readonly updateRoleUseCase: UpdateRole,
    private readonly deleteRoleUseCase: DeleteRole,
    private readonly finderByIdRoleCase: FinderById,
    private readonly finderRoleCase: FinderRole
  ) {}

  async create(request: Request, response: Response) {
    const data = request.body;
    try {
      await this.createRoleUseCase.run(data);
      response.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error creating role' });
    }
  }

  async update(request: Request, response: Response) {
    const id = request.params.role_id;
    const data = request.body;
    try {
      await this.updateRoleUseCase.run({ ...data, id });
      response.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error creating role' });
    }
  }

  async delete(request: Request, response: Response) {
    const id = request.params.role_id;
    try {
      await this.deleteRoleUseCase.run(id);
      response.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error deleting role' });
    }
  }

  async getById(request: Request, response: Response) {
    const id = request.params.role_id;
    try {
      const role = await this.finderByIdRoleCase.run(id);
      response.status(200).json({ data: role });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error to get role' });
    }
  }
  async getAll(request: Request, response: Response) {
    const { limit, page } = request.query;

    try {
      const data = await this.finderRoleCase.run(Number(limit), Number(page));
      response.status(200).json(data);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error to get all roles' });
    }
  }
}
