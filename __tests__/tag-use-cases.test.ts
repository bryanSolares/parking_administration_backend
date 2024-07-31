import { TagRepository } from '../src/parameters/core/repositories/tag-repository';
import { CreateTag } from '../src/parameters/application/use-cases/create-tag';
import { UpdateTag } from '../src/parameters/application/use-cases/update-tag';
import { DeleteTag } from '../src/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '../src/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '../src/parameters/application/use-cases/tag-finder';

const mocksTagRepository: jest.Mocked<TagRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn().mockReturnValue({}),
  getAll: jest.fn().mockReturnValue([])
};

describe('TAG: Use Cases', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should create a new tag', async () => {
    const createTag = new CreateTag(mocksTagRepository);
    await createTag.run({
      name: 'test tag',
      description: 'test description',
      status: 'ACTIVO'
    });
    expect(mocksTagRepository.create).toHaveBeenCalledWith({
      name: 'test tag',
      description: 'test description',
      status: 'ACTIVO'
    });
  });

  it('should update a tag and throw an error if tag not found', async () => {
    const updateTag = new UpdateTag(mocksTagRepository);
    await updateTag.run({
      id: '1',
      name: 'test tag',
      description: 'test description',
      status: 'ACTIVO'
    });
    expect(mocksTagRepository.update).toHaveBeenCalledWith({
      id: '1',
      name: 'test tag',
      description: 'test description',
      status: 'ACTIVO'
    });
    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(
      updateTag.run({
        id: '1',
        name: 'test tag',
        description: 'test description',
        status: 'ACTIVO'
      })
    ).rejects.toThrow('Tag not found');
  });

  it('should delete a tag and throw an error if tag not found', async () => {
    const deleteTag = new DeleteTag(mocksTagRepository);
    await deleteTag.run('1');
    expect(mocksTagRepository.delete).toHaveBeenCalledWith('1');

    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(deleteTag.run('1')).rejects.toThrow('Tag not found');
  });

  it('should find a tag by id and throw an error if tag not found', async () => {
    const tagFinderById = new TagFinderById(mocksTagRepository);
    await tagFinderById.run('1');
    expect(mocksTagRepository.getById).toHaveBeenCalledWith('1');

    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(tagFinderById.run('1')).rejects.toThrow('Tag not found');
  });

  it('should find all tags', async () => {
    const tagFinder = new TagFinder(mocksTagRepository);
    await tagFinder.run(1, 2);
    expect(mocksTagRepository.getAll).toHaveBeenCalled();
  });
});
