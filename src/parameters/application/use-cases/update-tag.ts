import { TagRepository } from '@src/parameters/core/repositories/tag-repository';
import { AppError } from '@src/server/config/err/AppError';

export class UpdateTag {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(data: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }) {
    const tag = await this.tagRepository.getById(data.id);

    if (!tag) {
      throw new AppError('TAG_NOT_FOUND', 404, 'Tag not found', true);
    }

    return this.tagRepository.update(data);
  }
}
