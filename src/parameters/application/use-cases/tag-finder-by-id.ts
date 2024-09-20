import { TagRepository } from '@src/parameters/core/repositories/tag-repository';
import { AppError } from '@src/shared/infrastructure/server/config/err/AppError';

export class TagFinderById {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(id: string) {
    const tag = await this.tagRepository.getById(id);

    if (!tag) {
      throw new AppError('TAG_NOT_FOUND', 404, 'Tag not found', true);
    }

    return tag;
  }
}
