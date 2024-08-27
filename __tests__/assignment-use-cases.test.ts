// import { mockAssignmentRepository } from "./__mocks__/assignment-mocks";
// import { mockEmployeeRepository } from "./__mocks__/assignment-mocks";
// import { mockAssignmentDomainService } from "./__mocks__/assignment-mocks";
// import { mockNotificationService } from "./__mocks__/assignment-mocks";
// import { mockLocationRepository  } from "./__mocks__/location-mocks";

// import { AssignmentMother } from "./mother/assignment-mother";
// import { LocationMother } from "./mother/location-mother";

// import { CreateAssignment } from '../src/assignment/application/user-cases/create-assignment';
// import { CreateAssignmentLoan } from '../src/assignment/application/user-cases/create-assignment-loan';
// import { CreateDeAssignment } from '../src/assignment/application/user-cases/create-deassignment';
// import { CreateDiscountNote } from '../src/assignment/application/user-cases/create-discount-note';
// import { AssignmentFinder } from '../src/assignment/application/user-cases/assignment-finder';
// import { AssignmentFinderById } from '../src/assignment/application/user-cases/assignment-finder-by-id';
// import { DeleteAssignmentLoan } from '../src/assignment/application/user-cases/delete-assignment-loan';
// import { UpdateStatusDiscountNote } from '../src/assignment/application/user-cases/update-status-discount-note';
// import { UpdateAssignment } from '../src/assignment/application/user-cases/update-assignment';
// import { GetEmployeeByCode } from '../src/assignment/application/user-cases/get-employee-by-code-from-ws';

// describe('ASSIGNMENT: Use Cases', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a new assignment', async () => {
//     mockLocationRepository.getSlotById.mockResolvedValueOnce(LocationMother.createSlot());
//     mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationMother.createLocation());
//     mockAssignmentDomainService.verifyIfSlotExistsAndIsAvailable = jest.fn().mockResolvedValue(true);

//     mockAssignmentDomainService.canCreateMoreSchedulesInSlot = jest.fn().mockReturnValue(true);

//     const createAssignment = new CreateAssignment(
//       mockAssignmentRepository,
//       mockAssignmentDomainService,
//       mockNotificationService
//     );
//     const assignment = AssignmentMother.createAssignment({})
//     await createAssignment.run(assignment);
//     expect(mockAssignmentRepository.createAssignment).toHaveBeenCalledWith(assignment);
//   });

//   it('should create assignment loan', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     const assignmentLoan = AssignmentMother.createAssignmentLoan({})
//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(assignment);
//     const createAssignmentLoan = new CreateAssignmentLoan(
//       mockAssignmentRepository,
//       mockNotificationService,
//       mockAssignmentDomainService
//     );

//     await createAssignmentLoan.run(assignmentLoan);
//     expect(mockAssignmentRepository.createAssignmentLoan).toHaveBeenCalledWith(assignmentLoan);
//   });

//   it('should create de-assignment', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     const deAssignment = AssignmentMother.createDeAssignment()
//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
//       assignment
//     );
//     const deAssignmentById = new CreateDeAssignment(
//       mockAssignmentRepository,
//       mockNotificationService
//     );
//     await deAssignmentById.run(assignment.id, deAssignment);
//     expect(mockAssignmentRepository.createDeAssignment).toHaveBeenCalledWith(assignment.id, deAssignment);
//   });

//   it('should throw an errors if assignment not found or assignment already inactive to create de-assignment', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     const deAssignment = AssignmentMother.createDeAssignment()
//     const deAssignmentById = new CreateDeAssignment(
//       mockAssignmentRepository,
//       mockNotificationService
//     );
//     await expect(
//       deAssignmentById.run(assignment.id, deAssignment)
//     ).rejects.toThrow('Assignment not found');

//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce({...assignment, status: 'INACTIVO'});

//     await expect(
//       deAssignmentById.run(assignment.id, deAssignment)
//     ).rejects.toThrow('Assignment is already inactive');
//   });

//   it('should create discount note', async () => {
//     const slot = LocationMother.createSlot()
//     const assignment = AssignmentMother.createAssignment({slot: {...slot, cost_type: 'DESCUENTO'}, discount_note: undefined})

//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(assignment);
//     mockLocationRepository.getSlotById.mockResolvedValueOnce({...slot,  cost_type: 'DESCUENTO'});
//     const createDiscountNote = new CreateDiscountNote(
//       mockAssignmentRepository,
//       mockNotificationService
//     );
//     await createDiscountNote.run(assignment.id);
//     expect(mockAssignmentRepository.createDiscountNote).toHaveBeenCalledWith(assignment.id);
//   });

//   it('should throw errors if assignment not exists, discount note already exists or slot is type SIN_COSTO', async () => {
//     const createDiscountNote = new CreateDiscountNote(
//       mockAssignmentRepository,
//       mockNotificationService
//     );

//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(null);
//     await expect(createDiscountNote.run('1')).rejects.toThrow(
//       'Assignment not found or status is not "ACTIVO"'
//     );
//     // mockLocationRepository.getSlotById.mockResolvedValueOnce(slotEntityMock);
//     // await expect(createDiscountNote.run('1')).rejects.toThrow(
//     //   'Cant create discount note for assignments type "COMPLEMENTO o SIN_COSTO"'
//     // );
//   });

//   it('should delete assignment loan', async () => {
//     const assignmentLoan = AssignmentMother.createAssignmentLoan({})
//     const deleteAssignmentLoan = new DeleteAssignmentLoan(
//       mockAssignmentRepository
//     );
//     mockAssignmentRepository.getAssignmentLoanById.mockResolvedValueOnce(assignmentLoan);
//     await deleteAssignmentLoan.run(assignmentLoan.assignment_id);
//     expect(mockAssignmentRepository.deleteAssignmentLoan).toHaveBeenCalledWith(assignmentLoan.assignment_id);
//   });

//   it('should update discount note status', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     const discountNote = AssignmentMother.createDiscountNote({})
//     mockAssignmentRepository.getDiscountNoteById.mockResolvedValueOnce(discountNote);
//     await new UpdateStatusDiscountNote(mockAssignmentRepository).run(assignment.id, 'APROBADO');
//     expect(mockAssignmentRepository.updateStatusDiscountNote).toHaveBeenCalledWith(assignment.id, 'APROBADO');
//   });

//   it('should update an assignment', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
//       assignment
//     );
//     const updateAssignment = new UpdateAssignment(mockAssignmentRepository);
//     await updateAssignment.run(assignment, []);
//     expect(mockAssignmentRepository.updateAssignment).toHaveBeenCalledWith(
//       assignment,
//       []
//     );
//   });

//   it('should find an assignment by id', async () => {
//     const assignment = AssignmentMother.createAssignment({})
//     mockAssignmentRepository.getAssignmentById.mockResolvedValueOnce(
//       assignment
//     );
//     const findById = new AssignmentFinderById(mockAssignmentRepository);
//     await findById.run(assignment.id);
//     expect(mockAssignmentRepository.getAssignmentById).toHaveBeenCalledWith(assignment.id);
//   });

//   it('should find all assignments', async () => {
//     const getAllAssignments = new AssignmentFinder(mockAssignmentRepository);
//     await getAllAssignments.run(1, 1);
//     expect(mockAssignmentRepository.getAssignments).toHaveBeenCalled();
//   });

//   it('should get employee information', async () => {
//     const employee = AssignmentMother.createEmployee()
//     mockEmployeeRepository.getEmployeeByCodefromWebService.mockResolvedValueOnce(
//       employee
//     );
//     await new GetEmployeeByCode(mockEmployeeRepository).run(employee.code_employee);
//     expect(
//       mockEmployeeRepository.getEmployeeByCodefromWebService
//     ).toHaveBeenCalled();
//   });
// });
