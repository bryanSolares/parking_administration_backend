import { TagRepository } from '@src/parameters/core/repositories/tag-repository';

export class DeleteTag {
  constructor(private readonly tagRepository: TagRepository) {}
  async run(id: string) {
    const tag = await this.tagRepository.getById(id);

    if (!tag) {
      throw new Error('Tag not found');
    }

    const tagWithAssignmentRelation =
      await this.tagRepository.getDetailTagsWithAssignment(id);

    if (tagWithAssignmentRelation) {
      throw new Error('You can not delete a tag related to an assignment');
    }

    return this.tagRepository.delete(id);
  }
}
