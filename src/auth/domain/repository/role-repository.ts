import { RoleEntity } from '../entities/role-entity';

export interface RoleRepository {
  create(user: {
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void>;
  update(user: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
  }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<RoleEntity | null>;
  getAll(
    limit: number,
    page: number
  ): Promise<{ data: RoleEntity[]; pageCounter: number }>;
}
