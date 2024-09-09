import request from 'supertest';
import { Server } from '../../src/server/server';
import { syncDatabase } from '../../src/server/config/database/sequelize';
import { sequelize } from '../../src/server/config/database/sequelize';
import { LocationMother } from './mother/location-mother';
import { QueryTypes } from 'sequelize';
import { faker } from '@faker-js/faker';
import { prepareDatabase } from "./utils/db";
import { cleanDatabase } from "./utils/db";
const server = new Server();


beforeAll(async () => {
  await server.startServer();
  await syncDatabase();
  await cleanDatabase();
});

beforeEach(async () => {
  await cleanDatabase();
  await prepareDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await sequelize.close();
  await server.stopServer();
});

const baseUrl = '/api/v1';
let dataRequest = LocationMother.createLocationRequest();

afterEach(() => {
  dataRequest = LocationMother.createLocationRequest();
})

describe('HEALTH CHECK', () => {
  it('should return 200 OK', async () => {
    const response = await request(server.getApp()).get(`${baseUrl}/health`);
    expect(response.status).toBe(200);
  });
});

describe('CREATE LOCATION', () => {
  it('should create a location', async () => {
    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .send(dataRequest)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Location created'
    });
  });

  it('should return error 400 if any slot contains status not allowed', async () => {
    dataRequest.slots[0].status = 'OCUPADO';

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message[0].code).toContain('invalid_enum_value');
  });

  it('should return error 400 if any slot contains slotType MUTILPLE and limitSchedules it not greater than 1', async () => {
    dataRequest.slots[1].slotType = 'MULTIPLE';
    dataRequest.slots[1].limitOfAssignments = 0;

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('The number of schedules for a multiple space should be greater than 1.')
  })

  it('should return error 400 if any slot contains costType SIN_COSTO and cost is greater than 0', async () => {

    dataRequest.slots[1].costType = 'SIN_COSTO';
    dataRequest.slots[1].cost = 1;

    const response = await request(server.getApp())
      .post(`${baseUrl}/parking/location`)
      .send(dataRequest)
      .expect(400);

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('You cannot assign a cost value if the type is SIN_COSTO.')
  })
});


// describe('UPDATE LOCATION', () => {

//   const createLocation = async () => {
//     await request(server.getApp())
//       .post(`${baseUrl}/parking/location`)
//       ////.set('Cookie', cookies)
//       .send(dataRequest)
//       .expect(201);
//   }

//   beforeAll(async () => {
//     await sequelize.query('delete from slot', {type: QueryTypes.DELETE});
//     await sequelize.query('delete from location', {type: QueryTypes.DELETE});
//   })

//   beforeEach(async () => {
//     await createLocation();
//   });

//   // it('should update a location', async () => {
//   //   const [location] : {id: string, name: string, address: string}[] = await sequelize.query('select * from location', {type: QueryTypes.SELECT})

//   //   dataRequest.name = 'UPDATED NAME';
//   //   const response = await request(server.getApp())
//   //     .put(`${baseUrl}/parking/location/${location.id}`)
//   //     ////.set('Cookie', cookies)
//   //     .send(dataRequest)
//   //     .expect(200);
//   //   expect(response.body).toEqual({
//   //     message: 'Location updated'
//   //   });
//   // })
// })



describe('GET LOCATION BY ID', () => {

  it('should return 200 OK', async () => {
    const [location] : {id: string, name: string, address: string}[] = await sequelize.query('select * from location', {type: QueryTypes.SELECT})
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/${location.id}`)
      .expect(200);

    const {body} = response;
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('id', location.id);
    expect(body.data).toHaveProperty('name', location.name);
    expect(body.data).toHaveProperty('address', location.address);
  })

  it('should return 400 BAD REQUEST if location id is not uuid', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/abc`)
      .expect(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
  })

  it('should return 404 NOT FOUND if location does not exist', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/${faker.string.uuid()}`)
      .expect(404);
      expect(response.body).toHaveProperty('message', 'Location not found');
  })

})

describe('GET LOCATIONS', () => {
  it('should return 200 OK', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location?limit=1&page=1`)
      ////.set('Cookie', cookies)
      .expect(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
  })

  it('should return 400 BAD REQUEST if limit or page is not a number', async () => {

     const response1 = await request(server.getApp())
      .get(`${baseUrl}/parking/location?limit=abc&page=1`)
      ////.set('Cookie', cookies)
      .expect(400);
      expect(response1.body).toHaveProperty('message');
      expect(response1.body.message[0]).toHaveProperty('message', 'Expected number, received nan');


    const response2 = await request(server.getApp())
        .get(`${baseUrl}/parking/location?limit=1&page=abc`)
        .expect(400);
        expect(response2.body).toHaveProperty('message');
        expect(response2.body.message[0]).toHaveProperty('message', 'Expected number, received nan');
    })

    it('should return 400 BAD REQUEST if limit is greater than 100', async () => {
      const response = await request(server.getApp())
        .get(`${baseUrl}/parking/location?limit=101&page=1`)
        .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message', 'Number must be less than or equal to 100');
    })


})

describe('DELETE LOCATION', () => {
  it('should return 200 OK', async () => {
    const [location] : {id: string, name: string, address: string}[] = await sequelize.query('select * from location', {type: QueryTypes.SELECT})
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/${location.id}`)
      .expect(200);
    expect(response.body).toEqual({
      message: 'Location deleted'
    });
  })

  it('should return 400 BAD REQUEST if location id is not uuid', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/abc`)
      .expect(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
  })

  it('should return 404 NOT FOUND if location does not exist', async () => {
    const response = await request(server.getApp())
      .delete(`${baseUrl}/parking/location/${faker.string.uuid()}`)
      .expect(404);
      expect(response.body).toHaveProperty('message', 'Location not found');
  })
})

describe('LOCATION STATS', () => {
  it('should return 200 OK', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/stats/overview`)
      .expect(200);
    expect(response.body).toHaveProperty('data');
  })

  it('should return 200 OK to get trend data', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/stats/trend?type=daily`)
      .expect(200);

      await request(server.getApp())
      .get(`${baseUrl}/parking/location/stats/trend?type=monthly`)
      ////.set('Cookie', cookies)
      .expect(200);

      await request(server.getApp())
      .get(`${baseUrl}/parking/location/stats/trend?type=weekly`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
  })

  it('should return 400 BAD REQUEST if type is not allowed', async () => {
    const response = await request(server.getApp())
      .get(`${baseUrl}/parking/location/stats/trend?type=abc`)
      .expect(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message[0]).toHaveProperty('message', "Invalid enum value. Expected 'daily' | 'weekly' | 'monthly', received 'abc'");
  })

})

