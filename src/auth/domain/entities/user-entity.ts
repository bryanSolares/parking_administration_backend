export type UserStatus = 'ACTIVO' | 'INACTIVO';

export class UserEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly status: UserStatus;
  readonly phone: string;
  //readonly role: string;

  constructor(
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    status: UserStatus,
    phone: string
    //role: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.status = status;
    this.phone = phone;
    //this.role = role;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    status: UserStatus;
    phone: string;
    //role: string;
  }): UserEntity {
    return new UserEntity(
      plainData.id,
      plainData.name,
      plainData.email,
      plainData.username,
      plainData.password,
      plainData.status,
      plainData.phone
      //plainData.role,
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      status: this.status,
      phone: this.phone
      //role: this.role
    };
  }
}
