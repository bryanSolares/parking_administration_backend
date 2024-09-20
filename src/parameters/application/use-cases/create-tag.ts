import { TagRepository } from '@src/parameters/core/repositories/tag-repository';

export class CreateTag {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(data: { name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }) {
    return this.tagRepository.create(data);
  }
}
