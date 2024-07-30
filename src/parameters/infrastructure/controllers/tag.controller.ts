import { Request, Response } from 'express';
import { CreateTag } from '@src/parameters/application/use-cases/create-tag';
import { UpdateTag } from '@src/parameters/application/use-cases/update-tag';
import { DeleteTag } from '@src/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '@src/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '@src/parameters/application/use-cases/tag-finder';

export class TagController {
  constructor(
    private readonly createTagUseCase: CreateTag,
    private readonly updateTagUseCase: UpdateTag,
    private readonly deleteTagUseCase: DeleteTag,
    private readonly tagFinderByIdUseCase: TagFinderById,
    private readonly tagFinderUseCase: TagFinder
  ) {}

  async create(req: Request, res: Response) {
    const { name, description, status } = req.body;

    try {
      await this.createTagUseCase.run({ name, description, status });
      res.status(201).json({ message: 'Tag created successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async update(req: Request, res: Response) {
    const { name, description, status } = req.body;
    const { tag_id } = req.params;
    try {
      await this.updateTagUseCase.run({
        id: tag_id,
        name,
        description,
        status
      });
      res.status(200).json({ message: 'Tag updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.tag_id;
    try {
      await this.deleteTagUseCase.run(id);
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getById(req: Request, res: Response) {
    const { tag_id } = req.params;
    try {
      const tag = await this.tagFinderByIdUseCase.run(tag_id);
      res.status(200).json({ data: tag });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    const { limit, page } = req.query;

    try {
      const data = await this.tagFinderUseCase.run(Number(limit), Number(page));
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
