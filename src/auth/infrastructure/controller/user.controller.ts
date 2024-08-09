import { Request, Response } from 'express';
import { CreateUser } from '@src/auth/application/use-cases/create-user';
import { UpdateUser } from '@src/auth/application/use-cases/update-user';
import { DeleteUser } from '@src/auth/application/use-cases/delete-user';
import { FinderById } from '@src/auth/application/use-cases/finder-by-id-user';
import { FinderUser } from '@src/auth/application/use-cases/finder-user';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUser,
    private readonly updateUserUseCase: UpdateUser,
    private readonly deleteUserUseCase: DeleteUser,
    private readonly finderByIdUseCase: FinderById,
    private readonly finderUseCase: FinderUser
  ) {}

  async create(request: Request, response: Response) {
    const data = request.body;
    try {
      await this.createUserUseCase.run(data);
      response.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error creating user' });
    }
  }

  async update(request: Request, response: Response) {
    const id = request.params.user_id;
    const data = request.body;
    try {
      await this.updateUserUseCase.run({ ...data, id });
      response.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error creating user' });
    }
  }

  async delete(request: Request, response: Response) {
    const id = request.params.user_id;
    try {
      await this.deleteUserUseCase.run(id);
      response.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error deleting user' });
    }
  }

  async getById(request: Request, response: Response) {
    const id = request.params.user_id;
    try {
      const user = await this.finderByIdUseCase.run(id);
      response.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error to get user' });
    }
  }
  async getAll(request: Request, response: Response) {
    const { limit, page } = request.query;

    try {
      const data = await this.finderUseCase.run(Number(limit), Number(page));
      response.status(200).json(data);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Error to get all users' });
    }
  }
}
