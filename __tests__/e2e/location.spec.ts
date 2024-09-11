import request from 'supertest';
import { faker } from '@faker-js/faker';

import { Server } from '../../src/server/server';
import { LocationMother } from '../utils/mother/location-mother';
import { cleanDatabase } from '../utils/db';

import { LocationModel } from '../../src/server/config/database/models/location.model';
import { SlotModel } from '../../src/server/config/database/models/slot.model';
import { SlotStatus } from '../../src/location/core/entities/slot-entity';

const baseUrl = '/api/v1/parking/location';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabase();
});

afterEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await server.stopServer();
});

describe('(e2e) Location and Slots', () => {
  describe('/parking/location', () => {
    describe.skip('POST', () => {
      it('should return 201 and persist location and slots when the request is valid', async () => {
        const locationRequest = LocationMother.createLocationRequest();

        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequest)
          .expect(201)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toEqual({ message: 'Location created' });
        expect(locations).toHaveLength(1);
        expect(locations[0]).toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address
        });
        expect(slots).toHaveLength(locationRequest.slots.length);
      });

      it('should return 400 and not persist any location if required fields are missing', async () => {
        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send({})
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message');
        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it("should return 400 if a slot has status 'OCUPADO'", async () => {
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots[0].status = 'OCUPADO';

        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequest)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0].code).toContain('invalid_enum_value');
        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it('should return 400 if slot is MULTIPLE with limit of 1 or SIMPLE with limit greater than 1', async () => {
        const locationRequestMultiple = LocationMother.createLocationRequest();
        locationRequestMultiple.slots[0].slotType = 'MULTIPLE';
        locationRequestMultiple.slots[0].limitOfAssignments = 1;

        const locationRequestSimple = LocationMother.createLocationRequest();
        locationRequestSimple.slots[0].slotType = 'SIMPLE';
        locationRequestSimple.slots[0].limitOfAssignments = 10;

        const responseMultiple = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestMultiple)
          .expect(400)
          .expect('Content-Type', /json/);

        const responseSimple = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestSimple)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(responseMultiple.body).toHaveProperty('message');
        expect(responseMultiple.body.message).toEqual(
          'The number of schedules for a multiple space should be greater than 1.'
        );

        expect(responseSimple.body).toHaveProperty('message');
        expect(responseSimple.body.message).toEqual(
          'The number of schedules cannot be greater than 1 or less than 1 for SIMPLE type spaces.'
        );

        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it('should return 400 if costType is DESCUENTO or COMPLEMENTO and cost is invalid', async () => {
        const locationRequestDiscount = LocationMother.createLocationRequest();
        locationRequestDiscount.slots[0].costType = 'DESCUENTO';
        locationRequestDiscount.slots[0].cost = -1;

        const locationRequestComplement =
          LocationMother.createLocationRequest();
        locationRequestComplement.slots[0].costType = 'COMPLEMENTO';
        locationRequestComplement.slots[0].cost = -1;

        const responseDiscount = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestDiscount)
          .expect(400)
          .expect('Content-Type', /json/);

        const responseComplement = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestComplement)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(responseDiscount.body).toHaveProperty('message');
        expect(responseDiscount.body.message).toEqual(
          'You must assign a value of whether the type of space is DESCUENTO or COMPLEMENTO.'
        );

        expect(responseComplement.body).toHaveProperty('message');
        expect(responseComplement.body.message).toEqual(
          'You must assign a value of whether the type of space is DESCUENTO or COMPLEMENTO.'
        );

        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });
    });

    describe.skip('GET', () => {
      describe('/', () => {
        it('Con registros en BD se deberá recibir un arreglo de ubicaciones con su estadística de ocupación según el estado de los slots y un contador de páginas', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.OCCUPIED,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.ACTIVE,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.INACTIVE,
            locationId: locationEntity.id
          });

          const locationDatabase = await LocationModel.findAll({ raw: true });

          const response = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=1`)
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data).toHaveLength(1);
          expect(locationDatabase[0]).toMatchObject({
            id: response.body.data[0].id,
            name: response.body.data[0].name,
            address: response.body.data[0].address
          });
          expect(response.body.data[0]).toMatchObject({
            totalSlots: 3,
            availableSlots: 1,
            unavailableSlots: 1,
            occupiedSlots: 1
          });
          expect(response.body).toHaveProperty('pageCounter', 1);
        });

        it('Si se envía un limite o pagina como texto, número negativo se recibe un 400 por estructura erronea de la petición', async () => {
          const response1 = await request(server.getApp())
            .get(`${baseUrl}?limit=abc&page=1`)
            .expect(400);
          expect(response1.body).toHaveProperty('message');
          expect(response1.body.message[0]).toHaveProperty(
            'message',
            'Expected number, received nan'
          );

          const response2 = await request(server.getApp())
            .get(`${baseUrl}?limit=-1&page=1`)
            .expect(400);
          expect(response2.body).toHaveProperty('message');
          expect(response2.body.message[0]).toHaveProperty(
            'message',
            'Number must be greater than or equal to 1'
          );

          const response3 = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=abc`)
            .expect(400);
          expect(response3.body).toHaveProperty('message');
          expect(response3.body.message[0]).toHaveProperty(
            'message',
            'Expected number, received nan'
          );

          const response4 = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=-1`)
            .expect(400);
          expect(response4.body).toHaveProperty('message');
          expect(response4.body.message[0]).toHaveProperty(
            'message',
            'Number must be greater than or equal to 1'
          );
        });

        it('Si se envía un limite mayor a 100, se recibe un 400 por limitación configurada en backend', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}?limit=101&page=1`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            'Number must be less than or equal to 100'
          );
        });
      });

      describe('/:location_id', () => {
        it('A partir de un id (uuid) debería devolver una ubicación existente en base de datos y un arreglo de slots asociados', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          const slotEntity = LocationMother.createSlotEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...slotEntity.toPrimitives(),
            locationId: locationEntity.id
          });
          const slotDatabase = await SlotModel.findAll({ raw: true });
          const locationDatabase = await LocationModel.findAll({ raw: true });

          const response = await request(server.getApp())
            .get(`${baseUrl}/${locationEntity.id}`)
            .expect(200);

          const { body } = response;
          expect(body).toHaveProperty('data');
          expect(locationDatabase[0]).toMatchObject({
            name: body.data.name,
            address: body.data.address
          });
          expect(slotDatabase).toHaveLength(1);
          expect(slotDatabase[0]).toMatchObject({
            slotNumber: body.data.slots[0].slotNumber,
            slotType: body.data.slots[0].slotType,
            limitOfAssignments: body.data.slots[0].limitOfAssignments,
            costType: body.data.slots[0].costType,
            cost: body.data.slots[0].cost,
            vehicleType: body.data.slots[0].vehicleType,
            status: body.data.slots[0].status
          });
        });

        it('Si un id no cumple con el formato uuid debería devolver un error 400 solicitando la estructura de id correcta', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/abc`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            'Invalid uuid'
          );
        });

        it('Se recibe un 404 al enviar un id (uuid) inexistente', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/${faker.string.uuid()}`)
            .expect(404);
          expect(response.body).toHaveProperty('message', 'Location not found');
        });
      });

      describe('/stats', () => {
        it('Se recibe un recuento del estado actual de los slots según sus estados en base de datos', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.OCCUPIED,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.ACTIVE,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.INACTIVE,
            locationId: locationEntity.id
          });

          const response = await request(server.getApp())
            .get(`${baseUrl}/stats/overview`)
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toMatchObject({
            totalSlots: 3,
            availableSlots: 1,
            unavailableSlots: 1,
            occupiedSlots: 1
          });
        });

        it('cuando se consulta las tendencias según tipo (daily, weekly, monthly) se debería recibir un arreglo de objetos con los datos', async () => {
          const trendDaily = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=daily`)
            .expect(200)
            .expect('Content-Type', /json/);

          const trendWeekly = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=weekly`)
            .expect(200)
            .expect('Content-Type', /json/);

          const trendMonthly = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=monthly`)
            .expect(200)
            .expect('Content-Type', /json/);

          expect(trendDaily.body).toHaveProperty('data');
          expect(trendWeekly.body).toHaveProperty('data');
          expect(trendMonthly.body).toHaveProperty('data');
        });

        it('cuando se solicita un tipo de tendencia inexistente se debería recibir un 400 con un mensaje de error indicando que el tipo solicitado no es válido', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=abc`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            "Invalid enum value. Expected 'daily' | 'weekly' | 'monthly', received 'abc'"
          );
        });
      });
    });

    describe('PUT', () => {});

    describe('DELETE', () => {
      it('Se elimina una ubicación y sus slots asociados con un id (uuid) válido', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        await SlotModel.create({
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        });

        const response = await request(server.getApp())
          .delete(`${baseUrl}/${locationEntity.id}`)
          .expect(200);

        const slotDatabase = await SlotModel.findAll({ raw: true });
        const locationDatabase = await LocationModel.findAll({ raw: true });
        expect(response.body).toEqual({
          message: 'Location deleted'
        });
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase).toHaveLength(0);
      });

      it('Si la ubicación tiene un slot "OCUPADO" no se puede eliminar', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        await SlotModel.create({
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED
        });

        const response = await request(server.getApp())
          .delete(`${baseUrl}/${locationEntity.id}`)
          .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty(
          'message',
          'You cannot inactivate a location with active assignments'
        );
      });

      it('Cuando un id (uuid) no cumple con el formato uuid se debería recibir un 400 solicitando la estructura de id correcta', async () => {
        const response = await request(server.getApp())
          .delete(`${baseUrl}/abc`)
          .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });

      it('Cuando se envía un id (uuid) inexistente indica que no existe la ubicación', async () => {
        const response = await request(server.getApp())
          .delete(`${baseUrl}/${faker.string.uuid()}`)
          .expect(404);
        expect(response.body).toHaveProperty('message', 'Location not found');
      });
    });
  });
});
