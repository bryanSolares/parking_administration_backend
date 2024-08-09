import { UserEntity } from '../entities/user-entity';

export interface UserRepository {
  create(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
  }): Promise<void>;
  update(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    id: string;
  }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<UserEntity | null>;
  getAll(
    limit: number,
    page: number
  ): Promise<{ data: UserEntity[]; pageCounter: number }>;
}
