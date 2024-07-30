import { TagRepository } from '@src/parameters/core/repositories/tag-repository';

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
      throw new Error('Tag not found');
    }

    return this.tagRepository.update(data);
  }
}
