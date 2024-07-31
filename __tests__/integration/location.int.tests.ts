// import request from 'supertest';

// import { Server } from '../../src/server/server';
// import { syncDatabase } from '../../src/server/config/database/sequelize';
// const server = new Server();

// beforeAll(async () => {
//   await server.startServer();
//   await syncDatabase();
// });

// afterAll(async () => {
//   await server.stopServer();
// });

// describe('Integration test for health', () => {
//   const baseUrl = '/api/v1';

//   it('should return 200 OK', async () => {
//     const response = await request(server.getApp()).get(`${baseUrl}/health`);
//     expect(response.status).toBe(200);
//   });
// });

// describe('Integration test for location', () => {
//   const baseUrl = '/api/v1';
//   let locationId: string;
//   let slotId: string;

//   it('should create a location', async () => {
//     const response = await request(server.getApp())
//       .post(`${baseUrl}/parking/location`)
//       .send({
//         name: '{{$randomCompanyName}}',
//         address: '{{$randomStreetAddress}}',
//         contact_reference: '{{$randomFullName}}',
//         phone: '+(502) 45573001',
//         email: 'test@test.com',
//         comments: '{{$randomAdjective}}',
//         status: 'INACTIVO',
//         slots: [
//           {
//             slot_number: '{{$randomBankAccountBic}}',
//             slot_type: 'MULTIPLE',
//             limit_schedules: 5,
//             status: 'INACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'CARRO',
//             cost: 100
//           }
//         ]
//       })
//       .expect(201);

//     expect(response.body).toEqual({
//       message: 'Location created'
//     });
//   });

//   it('should throw an error if missing properties', async () => {
//     const response = await request(server.getApp())
//       .post(`${baseUrl}/parking/location`)
//       .send({
//         name: '{{$randomCompanyName}}',

//         comments: '{{$randomAdjective}}',
//         status: 'INACTIVO',
//         slots: [
//           {
//             slot_number: '{{$randomBankAccountBic}}',
//             slot_type: 'MULTIPLE',
//             limit_schedules: 5,
//             status: 'INACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'CARRO',
//             cost: 100
//           }
//         ]
//       })
//       .expect(400);

//     // expect(response.body).toEqual({
//     //   message: 'Location created'
//     // });
//   });

//   it('should get all locations', async () => {
//     const response = await request(server.getApp()).get(
//       `${baseUrl}/parking/location`
//     );

//     locationId = response.body.data[0].id;
//     slotId = response.body.data[0].slots[0].id;

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveLength(1);
//   });

//   it('should get a location by id', async () => {
//     const response = await request(server.getApp())
//       .get(`${baseUrl}/parking/location/${locationId}`)
//       .expect(200);

//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveProperty('id', locationId);
//   });

//   it('should throw and error if id does not uuid', async () => {
//     const response = await request(server.getApp())
//       .get(`${baseUrl}/parking/location/abc`)
//       .expect(400);
//   });

//   it('should return error wrong id provided to get', async () => {
//     const response = await request(server.getApp())
//       .get(`${baseUrl}/parking/location/7c70cdd9-d29a-4f93-8c76-9ac1126917ec`)
//       .expect(404);
//     expect(response.body).toEqual({
//       message: 'Location not found'
//     });
//   });

//   it('should update a location', async () => {
//     const response = await request(server.getApp())
//       .put(`${baseUrl}/parking/location/${locationId}`)
//       .send({
//         name: "{% faker 'randomCompanySuffix' %}",
//         address: "{% faker 'randomStreetAddress' %}",
//         contact_reference: "{% faker 'randomFullName' %}",
//         phone: '+(502) 45454545',
//         email: 'test@test.com',
//         comments: '',
//         latitude: 1.2,
//         longitude: 2.1,
//         status: 'ACTIVO',
//         slots: [
//           {
//             id: `${slotId}`,
//             slot_number: 'abc-abc-abc',
//             slot_type: 'SIMPLE',
//             limit_schedules: 100,
//             status: 'ACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'MOTO',
//             cost: 100.5
//           },
//           {
//             slot_number: 'abc-abc-abc',
//             slot_type: 'SIMPLE',
//             limit_schedules: 100,
//             status: 'ACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'MOTO',
//             cost: 100.5
//           }
//         ]
//       })
//       .expect(200);

//     const locationUpdated = await request(server.getApp()).get(
//       `${baseUrl}/parking/location/${locationId}`
//     );

//     expect(locationUpdated.body.data.slots).toHaveLength(2);

//     expect(response.body).toEqual({
//       message: 'Location updated'
//     });
//   });

//   it('should return error but wrong id provided to update', async () => {
//     const response = await request(server.getApp())
//       .put(`${baseUrl}/parking/location/7c70cdd9-d29a-4f93-8c76-9ac1126917ec`)
//       .send({
//         name: "{% faker 'randomCompanySuffix' %}",
//         address: "{% faker 'randomStreetAddress' %}",
//         contact_reference: "{% faker 'randomFullName' %}",
//         phone: '+(502) 45454545',
//         email: 'test@test.com',
//         comments: '',
//         latitude: 1.2,
//         longitude: 2.1,
//         status: 'ACTIVO',
//         slots: [
//           {
//             id: `${slotId}`,
//             slot_number: 'abc-abc-abc',
//             slot_type: 'SIMPLE',
//             limit_schedules: 100,
//             status: 'ACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'MOTO',
//             cost: 100.5
//           },
//           {
//             slot_number: 'abc-abc-abc',
//             slot_type: 'SIMPLE',
//             limit_schedules: 100,
//             status: 'ACTIVO',
//             cost_type: 'DESCUENTO',
//             vehicle_type: 'MOTO',
//             cost: 100.5
//           }
//         ]
//       })
//       .expect(404);
//     expect(response.body).toEqual({
//       message: 'Location not found'
//     });
//   });

//   it('should return error but wrong id provide to update, should be uuid', async () => {
//     const response = await request(server.getApp())
//       .put(`${baseUrl}/parking/location/7c70cdd9-d29a-4f93-`)
//       .send()
//       .expect(400);
//     // expect(response.body).toEqual({
//     //   message: 'Location not found'
//     // });
//   });

//   it('should delete a slot', async () => {
//     const response = await request(server.getApp())
//       .delete(`${baseUrl}/parking/location/slots`)
//       .send({
//         slots: [slotId]
//       })
//       .expect(200);
//     expect(response.body).toEqual({
//       message: 'Slots deleted'
//     });
//   });

//   it('should throw an error if slots are empty', async () => {
//     const response = await request(server.getApp())
//       .delete(`${baseUrl}/parking/location/slots`)
//       .send({
//         slots: []
//       })
//       .expect(400);
//     expect(response.body).toEqual({
//       message: 'Slots cant be empty'
//     });
//   });

//   it('should return error but wrong id provided in array to delete must be uuid', async () => {
//     const response = await request(server.getApp())
//       .delete(`${baseUrl}/parking/location/slots`)
//       .send({
//         slots: ['7c70cdd9-d29a-4f93']
//       })
//       .expect(400);
//   });

//   it('should delete a location', async () => {
//     const response = await request(server.getApp())
//       .delete(`${baseUrl}/parking/location/${locationId}`)
//       .expect(200);
//     expect(response.body).toEqual({
//       message: 'Location deleted'
//     });
//   });

//   it('should return error but wrong id provided to delete', async () => {
//     const response = await request(server.getApp())
//       .delete(
//         `${baseUrl}/parking/location/7c70cdd9-d29a-4f93-8c76-9ac1126917ec`
//       )
//       .expect(404);
//     expect(response.body).toEqual({
//       message: 'Location not found'
//     });
//   });

//   //TODO: test not allow delete if slot have assignments or schedules
// });
