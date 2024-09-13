import request from 'supertest';

import { Server } from '../../src/server/server';
import { cleanDatabaseAssignmentTesting } from '../utils/db';
import { cleanDatabaseLocationTesting } from '../utils/db';
import { cleanDatabaseTagTesting } from '../utils/db';
import { AssignmentRequestMother } from '../utils/mother/assignment-mother';

import { LocationBuilder } from '../utils/builders/location-builder';
import { SlotBuilder } from '../utils/builders/location-builder';
import { TagBuilder } from '../utils/builders/tag-builder';
import { AssignmentHelper } from '../utils/helpers/assignment-helper';
import { LocationHelper } from '../utils/helpers/location-helper';
import { SlotStatus } from '../../src/location/core/entities/slot-entity';
import { faker } from '@faker-js/faker';
import { AssignmentBuilder } from '../utils/builders/assignment-builder';

const baseUrl = '/api/v1/assignment';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
  await cleanDatabaseTagTesting();
});

afterEach(async () => {
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
  await cleanDatabaseTagTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Assignment', () => {
  describe('POST', () => {
    it('Con un request correcto se crea una asignación, empleado, vehiculo, etiquetado y cambia estado de slot', async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withAvailableStatus()
        .withTypeSingle()
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Assignment created' });
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      const [slotDatabase] = await LocationHelper.getAllSlots();
      expect(slotDatabase.status).toBe(SlotStatus.OCCUPIED);
      expect(assignments).toHaveLength(1);
      expect(employees).toHaveLength(1);
      expect(vehicles).toHaveLength(1);
      expect(assignments[0]).toMatchObject({
        slotId: slot.id,
        employeeId: employees[0].id,
        parkingCardNumber: requestData.parkingCardNumber,
        assignmentDate: null
      });
      expect(employees[0]).toMatchObject({
        employeeCode: requestData.employee!.employeeCode,
        name: requestData.employee!.name,
        workplace: requestData.employee!.workplace,
        identifierDocument: requestData.employee!.identifierDocument,
        company: requestData.employee!.company,
        department: requestData.employee!.department,
        subManagement: requestData.employee!.subManagement,
        management1: requestData.employee!.management1,
        management2: requestData.employee!.management2
      });
      expect(vehicles[0]).toMatchObject({
        vehicleBadge: requestData.employee!.vehicles![0].vehicleBadge,
        color: requestData.employee!.vehicles![0].color,
        brand: requestData.employee!.vehicles![0].brand,
        model: requestData.employee!.vehicles![0].model,
        type: requestData.employee!.vehicles![0].type
      });
    });

    it('Para slot MULTIPLE se crean asignaciones según límite establecido en slot', async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withAvailableStatus()
        .withTypeMultiple(2)
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData1 =
        AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });
      const requestData2 =
        AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });
      const requestData3 =
        AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

      await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData1)
        .expect(201)
        .expect('Content-Type', /json/);

      await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData2)
        .expect(201)
        .expect('Content-Type', /json/);

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData3)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'message',
        'You can not create more assignments in this slot'
      );
      const assignmentsDatabase = await AssignmentHelper.getAllAssignments();
      const employeesDatabase = await AssignmentHelper.getAllEmployees();
      const vehiclesDatabase = await AssignmentHelper.getAllVehicles();
      const [slotDatabase] = await LocationHelper.getAllSlots();
      expect(slotDatabase.status).toBe(SlotStatus.OCCUPIED);
      expect(assignmentsDatabase).toHaveLength(2);
      expect(employeesDatabase).toHaveLength(2);
      expect(vehiclesDatabase).toHaveLength(2);
    });

    it('No se puede dos asignaciones para un mismo empleados si la primera asignación está en curso', async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withAvailableStatus()
        .withTypeMultiple(2)
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );

      await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(201)
        .expect('Content-Type', /json/);

      const timeOut = setTimeout(async () => {
        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(requestData)
          .expect(400)
          .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty(
          'message',
          'You can not create a new assignment for the same employee because the previous one is in progress'
        );
      }, 1000);
      clearTimeout(timeOut);
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(1);
      expect(employees).toHaveLength(1);
      expect(vehicles).toHaveLength(1);
    });

    it('Se puede crear asignación para un empleado existente y con asignaciones previas pero inactivas',async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder().withAvailableStatus().build(location.id);
      const tag = await new TagBuilder().build();
      const prevAssignment = await new AssignmentBuilder().buildWithStatusDeAssigned();
      const employee = AssignmentRequestMother.createEmployeeRequest({id: prevAssignment.employee.id});
      const requestData = AssignmentRequestMother.createAssignmentRequest({slotId: slot.id, employee, tags: [tag.id]});

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(201)
        .expect('Content-Type', /json/);

        expect(response.body).toEqual({ message: 'Assignment created' });
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(2);
        expect(employees).toHaveLength(1);
        expect(vehicles).toHaveLength(2);
    })

    it('Validación de estructura para datos del empleado y vehículo al crear una asignación', async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withAvailableStatus()
        .withTypeSingle()
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );
      delete requestData.employee!.employeeCode;

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(400)
        .expect('Content-Type', /json/);

      const requestData2 =
        AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

      delete requestData2.employee!.vehicles![0].vehicleBadge;

      const response2 = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData2)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('path', [
        'employee',
        'employeeCode'
      ]);
      expect(response2.body.message[0]).toHaveProperty('path', [
        'employee',
        'vehicles',
        0,
        'vehicleBadge'
      ]);
      const assignment = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignment).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });

    it('No se puede crear asignación a un slot que no existe', async () => {
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: faker.string.uuid(),
          tags: [tag.id]
        }
      );
      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Slot not found');
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });

    it('Slot enviado deberá ser un UUID', async () => {
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: 'abc',
          tags: [tag.id]
        }
      );
      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty(
        'message',
        'Invalid uuid'
      );
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });

    it('No se puede crear asignación para un slot DISPONIBLE pero con la ubicación INACTIVA', async () => {
      const location = await new LocationBuilder().withInactiveStatus().build();
      const slot = await new SlotBuilder()
        .withAvailableStatus()
        .withTypeSingle()
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'message',
        'You can not create an assignment if the location is inactive'
      );
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });

    it('No se puede crear asignación para un slot SIMPLE y estado OCUPADO', async () => {
      it;
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withOccupiedStatus()
        .withTypeSingle()
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'message',
        'Slot is occupied, you can not create an assignment in this slot'
      );
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });

    it('No se puede crear asignación para un slot INACTIVO', async () => {
      const location = await new LocationBuilder().withActiveStatus().build();
      const slot = await new SlotBuilder()
        .withInactiveStatus()
        .withTypeSingle()
        .build(location.id);
      const tag = await new TagBuilder().build();
      const requestData = AssignmentRequestMother.createAssignmentRequest(
        {
          slotId: slot.id,
          tags: [tag.id]
        }
      );

      const response = await request(server.getApp())
        .post(`${baseUrl}`)
        .send(requestData)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Slot is not available');
      const assignments = await AssignmentHelper.getAllAssignments();
      const employees = await AssignmentHelper.getAllEmployees();
      const vehicles = await AssignmentHelper.getAllVehicles();
      expect(assignments).toHaveLength(0);
      expect(employees).toHaveLength(0);
      expect(vehicles).toHaveLength(0);
    });
  });
});
