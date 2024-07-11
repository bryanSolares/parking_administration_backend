import request from 'supertest';

import { Server } from '../../server/server';
import { syncDatabase } from '../../server/config/database/sequelize';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await syncDatabase();
});

afterAll(async () => {
  await server.stopServer();
});

describe('Integration test for health', () => {
  const baseUrl = '/api/v1';

  it('should return 200 OK', async () => {
    const response = await request(server.getApp()).get(`${baseUrl}/health`);
    expect(response.status).toBe(200);
  });
});

describe('Integration test for location', () => {
  const baseUrl = '/api/v1';
  let locationId: string;
  let slotId: string;

  it('should create a location', async () => {
    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .send({
        name: 'Test location',
        address: 'Test address',
        slots: [
          {
            slot_number: 'abc',
            slot_type: 'SIMPLE'
          },
          {
            slot_number: 'abc',
            slot_type: 'MULTIPLE'
          }
        ]
      })
      .expect(201);

    expect(response.body).toEqual({
      message: 'Location created'
    });
  });

  it('should get all locations', async () => {
    const response = await request(server.getApp()).get(
      `${baseUrl}/parking/location`
    );

    locationId = response.body.data[0].id;
    slotId = response.body.data[0].slots[0].id;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
  });

  it('should get a location by id', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/${locationId}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id', locationId);
  });

  it('should return error wrong id provided to get', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/100`)
      .expect(404);
    expect(response.body).toEqual({
      message: 'Location not found'
    });
  });

  it('should update a location', async () => {
    const response = await request(server.getApp())
      .put(`${baseUrl}/parking/location/${locationId}`)
      .send({
        name: 'Test location',
        address: 'Test address',
        slots: []
      })
      .expect(200);

    const locationUpdated = await request(server.getApp()).get(
      `${baseUrl}/parking/location/${locationId}`
    );

    expect(locationUpdated.body.data.slots).toHaveLength(2);

    expect(response.body).toEqual({
      message: 'Location updated'
    });
  });

  it('should return error but wrong id provided to update', async () => {
    const response = await request(server.getApp())
      .put(`${baseUrl}/parking/location/100`)
      .send({
        id: '1',
        name: 'Test location',
        address: 'Test address'
      })
      .expect(404);
    expect(response.body).toEqual({
      message: 'Location not found'
    });
  });

  it('should delete a slot', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/slots`)
      .send({
        slots: [slotId]
      })
      .expect(200);
    expect(response.body).toEqual({
      message: 'Slots deleted'
    });
  });

  it('should throw an error if slots are empty', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/slots`)
      .send({
        slots: []
      })
      .expect(400);
    expect(response.body).toEqual({
      message: 'Slots cant be empty'
    });
  });

  it('should delete a location', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/${locationId}`)
      .expect(200);
    expect(response.body).toEqual({
      message: 'Location deleted'
    });
  });

  it('should return error but wrong id provided to delete', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/100`)
      .expect(404);
    expect(response.body).toEqual({
      message: 'Location not found'
    });
  });
});
