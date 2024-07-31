import { AssignmentEntity } from '../../src/assignment/core/entities/assignment-entity';
import { AssignmentLoadEntity } from '../../src/assignment/core/entities/assignment-load-entity';
import { DeAssignmentEntity } from '../../src/assignment/core/entities/deassignment-entity';
import { DiscountNoteEntity } from '../../src/assignment/core/entities/discount-note-entity';
import { EmployeeEntity } from '../../src/assignment/core/entities/employee-entity';
import { ScheduleEntity } from '../../src/assignment/core/entities/schedule-entity';
import { VehicleEntity } from '../../src/assignment/core/entities/vehicle-entity';
import { LocationEntity } from '../../src/location/core/entities/location-entity';
import { SlotEntity } from '../../src/location/core/entities/slot-entity';

export const ownerVehicleEntityMock = new VehicleEntity(
  '1',
  '1',
  'abc',
  'blue',
  'toyota',
  '2022',
  'CARRO'
);

export const guestVehicleEntityMock = new VehicleEntity(
  '2',
  '2',
  'abc',
  'blue',
  'toyota',
  '2022',
  'CARRO'
);
export const ownerEmployeeEntityMock = new EmployeeEntity(
  '1',
  'abc321',
  'Juan',
  'In Site',
  '123456',
  'claro',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'ACTIVO',
  [ownerVehicleEntityMock]
);

export const guestEmployeeEntityMock = new EmployeeEntity(
  '2',
  'abc321',
  'Juan',
  'In Site',
  '123456',
  'claro',
  '',
  '',
  '',
  '',
  '',
  '',
  'mail@mail.com',
  '',
  '',
  'ACTIVO',
  [guestVehicleEntityMock]
);

export const scheduleEntityMock = new ScheduleEntity(
  '1',
  'abc123',
  '08:00',
  '12:00',
  'ACTIVO'
);

export const assignmentLoanEntityMock = new AssignmentLoadEntity(
  '1',
  '1',
  guestEmployeeEntityMock,
  new Date(),
  new Date(),
  new Date(),
  'ACTIVO'
);

export const assignmentEntityMock = new AssignmentEntity(
  '1',
  'abc123',
  ownerEmployeeEntityMock,
  scheduleEntityMock,
  'ACTIVO'
);

export const slotEntityMock = new SlotEntity(
  '1',
  '1',
  'abc500',
  'SIMPLE',
  'SIN_COSTO',
  100,
  'CARRO',
  1,
  'DISPONIBLE'
);
export const locationEntityMock = new LocationEntity(
  '1',
  'Los angeles',
  'Calle 123',
  [slotEntityMock],
  'Carlos',
  '502 1234 7894',
  'JhJn0@example.com',
  'Comentario',
  34.123456,
  -118.123456,
  'ACTIVO',
  new Date(),
  new Date()
);

export const deAssignmentEntityMock = new DeAssignmentEntity(
  '1',
  '1',
  'Reasion',
  new Date(),
  false
);

export const discountNoteEntityMock = new DiscountNoteEntity('1', '1');
