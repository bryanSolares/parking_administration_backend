import { Router } from 'express';
import { Request, Response } from 'express';

import { assignmentController } from '../repositories/dependencies';

import { validateRequest } from '@shared/zod-validator';

import { assignmentCreateSchema } from '../utils/assignment-zod-schemas';
import { createDeAssignmentBodySchema } from '../utils/assignment-zod-schemas';
import { getAssignmentsSchemaForQuery } from '../utils/assignment-zod-schemas';
import { getEmployeeByCodeSchemaForParams } from '../utils/assignment-zod-schemas';
import { assignmentUpdateSchema } from '../utils/assignment-zod-schemas';
import { statusDiscountNoteBodySchema } from '../utils/assignment-zod-schemas';
import { assignmentIdSchema } from '../utils/assignment-zod-schemas';

const routes = Router();

// Employee
routes
  .get('/employee', (_: Request, res: Response) => {
    return res.status(400).json({ message: 'Code employee required' });
  })
  /**
   * @swagger
   *  /assignment/employee/{code}:
   *    get:
   *      summary: Get employee by code
   *      description: Get employee by code
   *      tags: [Employees]
   *      parameters:
   *        - in: path
   *          name: code
   *          required: true
   *          description: The employee code
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: Employee found
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Employee'
   */
  .get(
    '/employee/:code',
    validateRequest(getEmployeeByCodeSchemaForParams, 'params'),
    assignmentController.employeeFinderByCode.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment:
   *    post:
   *      summary: Create a new assignment
   *      description: Create a new assignment
   *      tags: [Assignments]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/AssignmentRequest'
   *      responses:
   *        201:
   *          description: Assignment created
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example:
   *                      Assignment created
   *        400:
   *          description: Bad request on structure request. Employee owner or guest has active assignment
   *        404:
   *          description: Slot not found
   *        500:
   *          description: Internal server error
   */
  .post(
    '/',
    validateRequest(assignmentCreateSchema, 'body'),
    assignmentController.createAssignment.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment/loan/{assignment_id}:
   *    post:
   *      summary: Create a new loan
   *      description: Create a new loan
   *      tags: [Assignments]
   *      parameters:
   *        - in: path
   *          name: assignment_id
   *          required: true
   *          description: The assignment id
   *          schema:
   *            type: string
   *            format: uuid
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/AssignmentLoanRequest'
   *      responses:
   *        201:
   *          description: Loan created
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example:
   *                      Loan created
   *        400:
   *          description: Bad request on structure request. Employee guest has active assignment
   *        404:
   *          description: Assignment not found
   *        500:
   *          description: Internal server error
   */
  .post(
    '/loan/:assignment_id',
    assignmentController.createAssignmentLoan.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment/{assignment_id}:
   *    put:
   *      summary: Update an assignment
   *      description: Update an assignment
   *      tags: [Assignments]
   *      parameters:
   *        - in: path
   *          name: assignment_id
   *          required: true
   *          description: The assignment id
   *          schema:
   *            type: string
   *            format: uuid
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/AssignmentRequestForUpdate'
   *      responses:
   *        200:
   *          description: Assignment updated
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example:
   *                      Assignment updated
   */
  .put(
    '/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(assignmentUpdateSchema, 'body'),
    assignmentController.updateAssignment.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment:
   *    get:
   *      summary: Get all assignments
   *      description: Get all assignments
   *      tags: [Assignments]
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            type: integer
   *          description: The page number
   *        - in: query
   *          name: limit
   *          schema:
   *            type: integer
   *          description: The number of items per page
   *      responses:
   *        200:
   *          description: Assignments found
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/AssignmentListResponse'
   */
  .get(
    '/',
    validateRequest(getAssignmentsSchemaForQuery, 'query'),
    assignmentController.assignmentFinder.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment/{id}:
   *    get:
   *      summary: Get an assignment by id
   *      description: Get an assignment by id
   *      tags: [Assignments]
   *      parameters:
   *        - in: path
   *          name: assignment_id
   *          required: true
   *          description: The assignment id
   *          schema:
   *            type: string
   *            format: uuid
   *      responses:
   *        200:
   *          description: Assignment found
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/AssignmentResponse'
   *        400:
   *          description: Invalid uuid or format error
   *        404:
   *          description: Assignment not found
   *        500:
   *          description: Internal server error
   *
   */
  //
  .get(
    '/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.assignmentFinderById.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment/de_assignment/{assignment_id}:
   *    post:
   *      summary: Create from assignment, you can create owner or guest
   *      description: Create from assignment, you can create owner or guest
   *      tags: [Assignments]
   *      parameters:
   *        - in: path
   *          name: assignment_id
   *          required: true
   *          description: The assignment id
   *          schema:
   *            type: string
   *            format: uuid
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/DeAssignmentOptionalDetails'
   *      responses:
   *        200:
   *          description: De assignment created
   *        400:
   *          description: Bad request on structure request
   *        404:
   *          description: Assignment not found
   *        500:
   *          description: Internal server error
   *
   */
  .post(
    '/de_assignment/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(createDeAssignmentBodySchema, 'body'),
    assignmentController.createDeAssignment.bind(assignmentController)
  )
  /**
   * @swagger
   *  /assignment/discount-note/{assignment_id}:
   *    post:
   *      summary: Create discount note
   *      description: Create discount note
   *      tags: [Assignments]
   *      parameters:
   *        - in: path
   *          name: assignment_id
   *          required: true
   *          description: The assignment id
   *          schema:
   *            type: string
   *            format: uuid
   *      responses:
   *        200:
   *          description: Discount note created
   *        400:
   *          description: Bad request on structure request
   *        404:
   *          description: Assignment not found
   *        500:
   *          description: Internal server error
   *
   */
  .post(
    '/discount-note/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.createDiscountNote.bind(assignmentController)
  )
  .put(
    '/discount-note/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(statusDiscountNoteBodySchema, 'body'),
    assignmentController.updateDiscountNode.bind(assignmentController)
  )
  .delete(
    '/assignment-loan/:assignment_id',
    validateRequest(assignmentIdSchema, 'params'),
    assignmentController.deleteAssignmentLoan.bind(assignmentController)
  );

//Schemas
/**
 * @swagger
 * components:
 *  schemas:
 *    Vehicle:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the vehicle (Optional)
 *          example: a1d8fec0-0c45-4f1b-a42c-5f2fad304c7d
 *        vehicle_badge:
 *          type: string
 *          description: Badge of the vehicle
 *          example: 1234567890
 *        color:
 *          type: string
 *          description: Color of the vehicle
 *          example: Red
 *        brand:
 *          type: string
 *          description: Brand of the vehicle
 *          example: Toyota
 *        model:
 *          type: string
 *          description: Model of the vehicle
 *          example: Corolla
 *        type:
 *          type: string
 *          description: Type of the vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: CARRO
 *    Employee:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the employee (Optional)
 *          example: a1d8fec0-0c45-4f1b-a42c-5f2fad304c7d
 *        code_employee:
 *          type: string
 *          description: Code of the employee
 *          example: johndoe
 *        name:
 *          type: string
 *          description: Name of the employee
 *          example: John Doe
 *        workplace:
 *          type: string
 *          description: Workplace of the employee
 *          example: Company Inc.
 *        identifier_document:
 *          type: string
 *          description: Identifier document of the employee
 *          example: 1234432150101
 *        company:
 *          type: string
 *          description: Company of the employee
 *          example: Example Corp
 *        department:
 *          type: string
 *          description: Department of the employee
 *          example: IT
 *        sub_management:
 *          type: string
 *          description: Sub-management of the employee
 *          example: Development
 *        management_1:
 *          type: string
 *          description: First management level of the employee
 *          example: Senior Management
 *        management_2:
 *          type: string
 *          description: Second management level of the employee
 *          example: Junior Management
 *        work_site:
 *          type: string
 *          description: Work site of the employee
 *          example: Main Office
 *        address:
 *          type: string
 *          description: Address of the employee
 *          example: 123 Main St
 *        email:
 *          type: string
 *          description: Email of the employee
 *          format: email
 *          example: example@example.com
 *        phone:
 *          type: string
 *          description: Phone number of the employee
 *          example: +(502) 45573001
 *        vehicles:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Vehicle'
 *          description: List of vehicles associated with the employee
 *    Schedule:
 *      type: object
 *      properties:
 *        start_time_assignment:
 *          type: string
 *          description: Start time of the assignment
 *          example: 10:00
 *        end_time_assignment:
 *          type: string
 *          description: End time of the assignment
 *          example: 12:00
 *    AssignmentLoan:
 *      type: object
 *      properties:
 *        start_date_assignment:
 *          type: string
 *          description: Start date of the assignment
 *          format: date
 *          example: 2024-07-15
 *        end_date_assignment:
 *          type: string
 *          description: End date of the assignment
 *          format: date
 *          example: 2024-07-16
 *        employee:
 *          $ref: '#/components/schemas/Employee'
 *          description: Employee information for the assignment loan
 *    AssignmentRequest:
 *      type: object
 *      properties:
 *        slot_id:
 *          type: string
 *          description: Unique identifier for the slot
 *          example: 1eb76106-2726-47c2-814e-ac16d831560d
 *        employee:
 *          $ref: '#/components/schemas/Employee'
 *        schedule:
 *          $ref: '#/components/schemas/Schedule'
 *        assignment_loan:
 *          $ref: '#/components/schemas/AssignmentLoan'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Vehicle:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the vehicle (Optional)
 *          example: 123e4567-e89b-12d3-a456-426614174000
 *        vehicle_badge:
 *          type: string
 *          description: Badge of the vehicle
 *          example: 1234567890
 *        color:
 *          type: string
 *          description: Color of the vehicle
 *          example: Red
 *        brand:
 *          type: string
 *          description: Brand of the vehicle
 *          example: Toyota
 *        model:
 *          type: string
 *          description: Model of the vehicle
 *          example: Corolla
 *        type:
 *          type: string
 *          description: Type of the vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: CARRO
 *    Employee:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the employee
 *          example: 61f978bc-040a-48d9-affe-fcce9b1b7c28
 *        code_employee:
 *          type: string
 *          description: Code of the employee
 *          example: johndoe
 *        name:
 *          type: string
 *          description: Name of the employee
 *          example: John Doe
 *        workplace:
 *          type: string
 *          description: Workplace of the employee
 *          example: Company Inc.
 *        identifier_document:
 *          type: string
 *          description: Identifier document of the employee
 *          example: 1234432150101
 *        company:
 *          type: string
 *          description: Company of the employee
 *          example: Example Corp
 *        department:
 *          type: string
 *          description: Department of the employee
 *          example: IT
 *        sub_management:
 *          type: string
 *          description: Sub-management of the employee
 *          example: Development
 *        management_1:
 *          type: string
 *          description: First management level of the employee
 *          example: Senior Management
 *        management_2:
 *          type: string
 *          description: Second management level of the employee
 *          example: Junior Management
 *        work_site:
 *          type: string
 *          description: Work site of the employee
 *          example: Main Office
 *        address:
 *          type: string
 *          description: Address of the employee
 *          example: 123 Main St
 *        email:
 *          type: string
 *          description: Email of the employee
 *          format: email
 *          example: solares.josue@outlook.com
 *        phone:
 *          type: string
 *          description: Phone number of the employee
 *          example: +(502) 45573001
 *        vehicles:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Vehicle'
 *          description: List of vehicles associated with the employee
 *    AssignmentLoanRequest:
 *      type: object
 *      properties:
 *        start_date_assignment:
 *          type: string
 *          description: Start date of the assignment
 *          format: date
 *          example: 2024-07-15
 *        end_date_assignment:
 *          type: string
 *          description: End date of the assignment
 *          format: date
 *          example: 2024-07-16
 *        employee:
 *          $ref: '#/components/schemas/Employee'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Vehicle:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the vehicle (Optional)
 *          example: f07f558f-0f65-4ef4-a683-17a5c7fa12c7
 *        vehicle_badge:
 *          type: string
 *          description: Badge of the vehicle
 *          example: 1234567890 - owner
 *        color:
 *          type: string
 *          description: Color of the vehicle
 *          example: Red - owner
 *        brand:
 *          type: string
 *          description: Brand of the vehicle
 *          example: Toyota - owner
 *        model:
 *          type: string
 *          description: Model of the vehicle
 *          example: Corolla - owner
 *        type:
 *          type: string
 *          description: Type of the vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: CAMION
 *    EmployeeForUpdate:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the employee
 *          example: aa83c50f-c13a-4623-87ab-219a8e6dbc14
 *        vehicles:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Vehicle'
 *          description: List of vehicles associated with the employee
 *    Schedule:
 *      type: object
 *      properties:
 *        start_time_assignment:
 *          type: string
 *          description: Start time of the assignment
 *          example: 10:00
 *        end_time_assignment:
 *          type: string
 *          description: End time of the assignment
 *          example: 15:00
 *    AssignmentLoanForUpdate:
 *      type: object
 *      properties:
 *        start_date_assignment:
 *          type: string
 *          description: Start date of the assignment
 *          format: date
 *          example: 2024-07-15
 *        end_date_assignment:
 *          type: string
 *          description: End date of the assignment
 *          format: date
 *          example: 2024-07-16
 *        employee:
 *          $ref: '#/components/schemas/EmployeeForUpdate'
 *    AssignmentRequestForUpdate:
 *      type: object
 *      properties:
 *        employee:
 *          $ref: '#/components/schemas/EmployeeForUpdate'
 *        schedule:
 *          $ref: '#/components/schemas/Schedule'
 *        assignment_loan:
 *          $ref: '#/components/schemas/AssignmentLoanForUpdate'
 *        vehicles_for_delete:
 *          type: array
 *          items:
 *            type: string
 *            description: Unique identifier for the vehicle to delete. Array must be empty
 *          example:
 *            - f07f558f-0f65-4ef4-a683-17a5c7fa12c7
 *            - 1217f20a-6c61-41ec-a6c0-0a11d9e8cb3a
 *            - 538d13bd-a1fc-4927-832f-2209e0594e65
 *            - b0a97dfa-5d37-4666-bace-8682fce19660
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Vehicle:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the vehicle
 *          example: 343f76f3-24b8-44ff-9d3d-c76476bd8c78
 *        vehicle_badge:
 *          type: string
 *          description: Badge of the vehicle
 *          example: 82680397
 *        color:
 *          type: string
 *          description: Color of the vehicle
 *          example: gold
 *        brand:
 *          type: string
 *          description: Brand of the vehicle
 *          example: olive
 *        model:
 *          type: string
 *          description: Model of the vehicle
 *          example: black
 *        type:
 *          type: string
 *          description: Type of the vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: CARRO
 *    Employee:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the employee
 *          example: 99ac7d61-aecc-4277-9720-5b256b88c808
 *        code_employee:
 *          type: string
 *          description: Code of the employee
 *          example: dannie
 *        name:
 *          type: string
 *          description: Name of the employee
 *          example: Miss Vicky Boyle
 *        workplace:
 *          type: string
 *          description: Workplace of the employee
 *          example: Group
 *        identifier_document:
 *          type: string
 *          description: Identifier document of the employee
 *          example: 1234432150101
 *        company:
 *          type: string
 *          description: Company of the employee
 *          example: Bosco, Rau and Gleichner
 *        department:
 *          type: string
 *          description: Department of the employee
 *          example: Creative
 *        sub_management:
 *          type: string
 *          description: Sub-management of the employee
 *          example: Factors
 *        management_1:
 *          type: string
 *          description: First management level of the employee
 *          example: Solutions
 *        management_2:
 *          type: string
 *          description: Second management level of the employee
 *          example: Branding
 *        work_site:
 *          type: string
 *          description: Work site of the employee
 *          example: Response
 *        address:
 *          type: string
 *          description: Address of the employee
 *          example: 8110 Murray Crescent
 *        email:
 *          type: string
 *          description: Email of the employee
 *          format: email
 *          example: solares.josue@outlook.com
 *        phone:
 *          type: string
 *          description: Phone number of the employee
 *          example: +(502) 45573001
 *        access_token:
 *          type: string
 *          description: Access token of the employee (Optional)
 *          nullable: true
 *          example: null
 *        access_token_status:
 *          type: string
 *          description: Status of the access token
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: INACTIVO
 *        vehicles:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Vehicle'
 *          description: List of vehicles associated with the employee
 *    Location:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the location
 *          example: 2714a010-68f8-4eac-b9aa-cf85b9866f39
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Conn, Bogan and Bechtelar
 *        address:
 *          type: string
 *          description: Address of the location
 *          example: 6395 Rice Grove
 *        contact_reference:
 *          type: string
 *          description: Contact reference for the location
 *          example: Clara Green
 *        phone:
 *          type: string
 *          description: Phone number of the location
 *          example: +(502) 45573001
 *        email:
 *          type: string
 *          description: Email of the location
 *          format: email
 *          example: Milan94@hotmail.com
 *        comments:
 *          type: string
 *          description: Additional comments about the location
 *          example: online
 *        latitude:
 *          type: number
 *          description: Latitude of the location
 *          example: 0
 *        longitude:
 *          type: number
 *          description: Longitude of the location
 *          example: 0
 *        status:
 *          type: string
 *          description: Status of the location
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *    Slot:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the slot
 *          example: 1eb76106-2726-47c2-814e-ac16d831560d
 *        slot_number:
 *          type: string
 *          description: The slot number
 *          example: DOVUCCG1
 *        slot_type:
 *          type: string
 *          description: The type of slot
 *          enum:
 *            - SIMPLE
 *            - MULTIPLE
 *          example: MULTIPLE
 *        limit_schedules:
 *          type: number
 *          description: Limit schedule must be a number and should be greater than 0 and less than 24
 *          minimum: 0
 *          maximum: 24
 *          example: 5
 *        vehicle_type:
 *          type: string
 *          description: The type of vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: CARRO
 *        cost_type:
 *          type: string
 *          description: The cost type
 *          enum:
 *            - SIN_COSTO
 *            - DESCUENTO
 *            - COMPLEMENTO
 *          example: DESCUENTO
 *        cost:
 *          type: number
 *          description: The cost
 *          example: 200
 *        status:
 *          type: string
 *          description: The status of the slot
 *          enum:
 *            - DISPONIBLE
 *            - OCUPADO
 *            - INACTIVO
 *          example: OCUPADO
 *        location:
 *          $ref: '#/components/schemas/Location'
 *          description: The location of the slot
 *    Schedule:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the schedule
 *          example: 8a02b306-d781-49a8-9454-24abc74a55e2
 *        start_time_assignment:
 *          type: string
 *          description: Start time of the assignment
 *          example: 10:00:00
 *        end_time_assignment:
 *          type: string
 *          description: End time of the assignment
 *          example: 12:00:00
 *        status:
 *          type: string
 *          description: Status of the schedule
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *    AssignmentLoan:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the assignment loan
 *          example: edc31762-2fac-40eb-8636-4713e63254aa
 *        employee_id:
 *          type: string
 *          description: Unique identifier for the employee
 *          example: 154bf11e-f074-4d87-8170-7f1021dc396c
 *        start_date_assignment:
 *          type: string
 *          description: Start date of the assignment
 *          format: date-time
 *          example: 2024-07-15T00:00:00.000Z
 *        end_date_assignment:
 *          type: string
 *          description: End date of the assignment
 *          format: date-time
 *          example: 2024-07-16T00:00:00.000Z
 *        assignment_date:
 *          type: string
 *          description: Date of the assignment
 *          format: date-time
 *          example: 2024-07-23T17:52:45.121Z
 *        status:
 *          type: string
 *          description: Status of the assignment loan
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        employee:
 *          $ref: '#/components/schemas/Employee'
 *    AssignmentData:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the assignment
 *          example: 0ef77d47-3559-429e-be1c-4ea4fa6f29e6
 *        assignment_date:
 *          type: string
 *          description: Date of the assignment
 *          format: date-time
 *          example: 2024-07-23T17:52:44.963Z
 *        status:
 *          type: string
 *          description: Status of the assignment
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        employee:
 *          $ref: '#/components/schemas/Employee'
 *        slot:
 *          $ref: '#/components/schemas/Slot'
 *        schedule:
 *          $ref: '#/components/schemas/Schedule'
 *        assignment_loan:
 *          $ref: '#/components/schemas/AssignmentLoan'
 *    AssignmentResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/AssignmentData'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    LocationSummary:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Conn, Bogan and Bechtelar
 *    SlotSummary:
 *      type: object
 *      properties:
 *        slot_number:
 *          type: string
 *          description: The slot number
 *          example: DOVUCCG1
 *        location:
 *          $ref: '#/components/schemas/LocationSummary'
 *          description: Location of the slot
 *    EmployeeSummary:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the employee
 *          example: Miss Vicky Boyle
 *        email:
 *          type: string
 *          description: Email of the employee
 *          format: email
 *          example: solares.josue@outlook.com
 *        phone:
 *          type: string
 *          description: Phone number of the employee
 *          example: +(502) 45573001
 *    AssignmentSummary:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the assignment
 *          example: 0ef77d47-3559-429e-be1c-4ea4fa6f29e6
 *        assignment_date:
 *          type: string
 *          description: Date of the assignment
 *          format: date-time
 *          example: 2024-07-23T17:52:44.963Z
 *        status:
 *          type: string
 *          description: Status of the assignment
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        created_at:
 *          type: string
 *          description: Creation date of the assignment
 *          format: date-time
 *          example: 2024-07-23T17:52:44.964Z
 *        slot:
 *          $ref: '#/components/schemas/SlotSummary'
 *          description: Summary of the slot
 *        employee:
 *          $ref: '#/components/schemas/EmployeeSummary'
 *          description: Summary of the employee
 *    AssignmentListResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/AssignmentSummary'
 *          description: List of assignments
 *        pageCounter:
 *          type: integer
 *          description: The current page number
 *          example: 1
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    DeAssignmentOptionalDetails:
 *      type: object
 *      properties:
 *        reason:
 *          type: string
 *          description: Reason for the de-assignment
 *          example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 *        de_assignment_date:
 *          type: string
 *          description: Date of the de-assignment
 *          format: date
 *          example: 2024-07-22
 */

export default routes;
