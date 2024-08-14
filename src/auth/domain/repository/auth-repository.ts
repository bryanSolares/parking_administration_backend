export interface AuthRepository {
  login(user: {
    username: string;
    password: string;
  }): Promise<{ token: string; refresh: string }>;
}
