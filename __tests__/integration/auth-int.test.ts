import request from "supertest";
import { Server } from '../../src/server/server';
import { sequelize } from "../../src/server/config/database/sequelize";

const server = new Server();

const preparteDatabase = async () => {
  try {
    await sequelize.query(
      `INSERT INTO role
  	(id, name, description, status, created_at, updated_at)
    VALUES('fa15f4b4-0330-4020-94bc-3a118e68deb9', 'Wesley Bernhard', 'Porro minus aut eligendi et ut non reprehenderit.', 'ACTIVO', '2024-08-13 23:53:22', '2024-08-13 23:53:22');`
    );

    await sequelize.query(
      `INSERT INTO resource
  	(id, slug, description, created_at, updated_at)
    VALUES('13a87ee9-5290-445b-8b6a-d2e5aea9eb8b', 'manage_parking', 'Parking administrator', '2024-08-13 00:00:00', '2024-08-13 00:00:00');`
    );

    await sequelize.query(
      `INSERT INTO role_detail
  	(role_id, resource_id, can_access, created_at, updated_at)
    VALUES('fa15f4b4-0330-4020-94bc-3a118e68deb9', '13a87ee9-5290-445b-8b6a-d2e5aea9eb8b', 1, '2024-08-13 23:53:22', '2024-08-13 23:53:22');`
    );

    await sequelize.query(
      `INSERT INTO user
  	(id, username, name, email, phone, password, role_id, status, created_at, updated_at)
    VALUES('0421958e-8630-4ee0-ba8d-a487b8c4c9f6', 'Janie_Frami', 'Rosie Hane', 'Jerel69@hotmail.com', '+(502) 45573001', 'ODHp5Hv7CXzuclf', 'fa15f4b4-0330-4020-94bc-3a118e68deb9', 'ACTIVO', '2024-08-14 00:24:50', '2024-08-14 00:36:41');`
    );
  } catch (error) {
    console.log(error);
  }
};

const inactivateUser = async () => {
  await sequelize.query(
    `UPDATE user
  	SET status = 'INACTIVO'
    WHERE username = 'Janie_Frami';`
  );
};

beforeAll(async () => {
  await server.startServer();
  await sequelize.sync();
  await preparteDatabase();
});

afterAll(async () => {
  await server.stopServer();
});

const baseUrl = '/api/v1';
describe('INTEGRATION: Auth', () => {

  describe.skip('POST /auth/login', () => {
    it('should return a token', async () => {
      const response = await request(server.getApp())
        .post( `${baseUrl}/auth/login`)
        .send({username: 'Janie_Frami', password: 'ODHp5Hv7CXzuclf'});

      const cookies = response.headers['set-cookie'];
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.status).toBe(200);
      expect(cookies).toBeDefined();

    });

    it('return 401 if username and password is valid but user is inactive', async () => {
      await inactivateUser();
      const response = await request(server.getApp())
        .post( `${baseUrl}/auth/login`)
        .send({username: 'Janie_Frami', password: 'ODHp5Hv7CXzuclf'});
      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    });

    // it('return 401 if username or password is incorrect', async () => {
    //   const response = await request(server.getApp())
    //     .post( `${baseUrl}/auth/login`)
    //     .send({username: 'Janie_Frami', password: 'ODHp5Hv7CXzuclf1'});
    //   expect(response.status).toBe(401);
    //   expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    // });

    it('return 400 if username and password is empty', async () => {
      const response = await request(server.getApp())
        .post( `${baseUrl}/auth/login`)
        .send({username: '', password: ''});
      expect(response.status).toBe(400);
    });

    it('return 400 if username is empty', async () => {
      const response = await request(server.getApp())
        .post( `${baseUrl}/auth/login`)
        .send({username: '', password: 'ODHp5Hv7CXzuclf'});
      expect(response.status).toBe(400);
    });

    it('return 400 if password is empty', async () => {
      const response = await request(server.getApp())
        .post( `${baseUrl}/auth/login`)
        .send({username: 'Janie_Frami', password: ''});
      expect(response.status).toBe(400);
    });
  });

});
