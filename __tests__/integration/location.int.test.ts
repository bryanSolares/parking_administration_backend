import request from 'supertest';
import { Server } from '../../src/server/server';
import { syncDatabase } from '../../src/server/config/database/sequelize';
import { sequelize } from '../../src/server/config/database/sequelize';
import { LocationMother } from './mother/location-mother';
const server = new Server();

let cookies: string;

const initUser = async () => {
  await syncDatabase();
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

beforeAll(async () => {
  await server.startServer();
  await syncDatabase();
  await initUser();

  const authResponse = await request(server.getApp())
    .post(`${baseUrl}/auth/login`)
    .send({
      username: 'Janie_Frami',
      password: 'ODHp5Hv7CXzuclf'
    });

  cookies = authResponse.headers['set-cookie'];
});

afterAll(async () => {
  await server.stopServer();
});

const baseUrl = '/api/v1';

describe('HEALTH CHECK', () => {
  it('should return 200 OK', async () => {
    const response = await request(server.getApp()).get(`${baseUrl}/health`);
    expect(response.status).toBe(200);
  });
});

describe('CREATE LOCATION', () => {
  const dataRequest = LocationMother.createLocationRequest();
  it('should create a location', async () => {
    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .set('Cookie', cookies)
      .send(dataRequest)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Location created'
    });
  });

  it('should return error 400 if any slot contains status not allowed', async () => {
    const dataRequest = LocationMother.createLocationRequest();
    dataRequest.slots[0].status = 'OCUPADO';

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .set('Cookie', cookies)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message[0].code).toContain('invalid_enum_value');
  });

  it('should return error 400 if any slot contains slotType MUTILPLE and limitSchedules it not greater than 1', async () => {
    const dataRequest = LocationMother.createLocationRequest();
    dataRequest.slots[1].slotType = 'MULTIPLE';
    dataRequest.slots[1].limitOfAssignments = 0;

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .set('Cookie', cookies)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('The number of schedules for a multiple space should be greater than 1.')
  })

  it('should return error 400 if any slot contains costType SIN_COSTO and cost is greater than 0', async () => {

    const dataRequest = LocationMother.createLocationRequest();
    dataRequest.slots[1].costType = 'SIN_COSTO';
    dataRequest.slots[1].cost = 1;

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .set('Cookie', cookies)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('You cannot assign a cost value if the type is SIN_COSTO.')
  })


});


