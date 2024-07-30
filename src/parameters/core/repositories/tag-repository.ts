import { TagEntity as Tag } from '../entities/tag-entity';

export interface TagRepository {
  create(tag: {
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void>;
  update(tag: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Tag | null>;
  getAll(
    limit: number,
    page: number
  ): Promise<{ data: Tag[]; pageCounter: number }>;
}
