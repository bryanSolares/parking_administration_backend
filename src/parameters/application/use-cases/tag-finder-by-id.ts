import { TagRepository } from '@src/parameters/core/repositories/tag-repository';

export class TagFinderById {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(id: string) {
    const tag = await this.tagRepository.getById(id);

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  }
}
