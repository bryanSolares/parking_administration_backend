import request from 'supertest';
import { Server } from '../../src/server/server';
import { syncDatabase } from '../../src/server/config/database/sequelize';
import { sequelize } from '../../src/server/config/database/sequelize';

import { prepareDatabase } from "./utils/db";
import { cleanDatabase } from "./utils/db";
import { AssignmentMotherRequest } from './mother/assignment-mother';

const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await syncDatabase();
  await prepareDatabase();
});

beforeEach(async () => {
  await cleanDatabase();
  await prepareDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await server.stopServer();
  await sequelize.close();
});

const baseUrl = '/api/v1';
//let dataRequest = AssignmentMotherRequest.createAssignmentRequest({});

afterEach(() => {
  //dataRequest = AssignmentMotherRequest.createAssignmentRequest({});
});

describe.skip('CREATE ASSIGNMENT', () => {

  it('should create an assignment', async () => {
    const dataRequest = AssignmentMotherRequest.createAssignmentRequest({});
    dataRequest.slotId = 'fa15f4b4-0330-4020-94bc-3a118e68deb8';
    dataRequest.tags.push('76425a22-a237-42a9-92fc-9368ed807893');

    const response = await request(server.getApp())
      .post(`${baseUrl}/assignment`)
      .send(dataRequest)
      .expect(201);


    expect(response.body).toEqual({
      message: 'Assignment created'
    });
  });

});
