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
  it('should return 200 OK', async () => {
    const response = await request(server.getApp()).get('/api/v1/health');
    expect(response.status).toBe(200);
  });
});

describe('Integration test for location', () => {
  it('should create a location', async () => {
    const response = await request(server.getApp())
      .post('/api/v1/locations')
      .send({
        id: '1',
        name: 'Test location',
        address: 'Test address'
      })
      .expect(201);

    expect(response.body).toEqual({
      message: 'Location created'
    });
  });

  it('should get all locations', async () => {
    const response = await request(server.getApp()).get('/api/v1/locations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
  });

  it('should get a location by id', async () => {
    const response = await request(server.getApp())
      .get('/api/v1/locations/1')
      .expect(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id', 1);
  });

  it('should return error wrong id provided to get', async () => {
    const response = await request(server.getApp())
      .get('/api/v1/locations/100')
      .expect(404);
    expect(response.body).toEqual({
      message: 'Location not found'
    });
  });

  it('should update a location', async () => {
    const response = await request(server.getApp())
      .put('/api/v1/locations/1')
      .send({
        id: '1',
        name: 'Test location',
        address: 'Test address'
      })
      .expect(200);
    expect(response.body).toEqual({
      message: 'Location updated'
    });
  });

  it('should return error but wrong id provided to update', async () => {
    const response = await request(server.getApp())
      .put('/api/v1/locations/100')
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

  it('should delete a location', async () => {
    const response = await request(server.getApp())
      .delete('/api/v1/locations/1')
      .expect(200);
    expect(response.body).toEqual({
      message: 'Location deleted'
    });
  });

  it('should return error but wrong id provided to delete', async () => {
    const response = await request(server.getApp())
      .delete('/api/v1/locations/100')
      .expect(404);
    expect(response.body).toEqual({
      message: 'Location not found'
    });
  });
});
