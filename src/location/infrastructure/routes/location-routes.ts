import { Router } from 'express';

import { locationCreateSchema } from '../utils/location-zod-schemas';
import { locationUpdateSchema } from '../utils/location-zod-schemas';
import { locationUpdateParamsSchema } from '../utils/location-zod-schemas';
import { locationDeleteParamsSchema } from '../utils/location-zod-schemas';
import { getLocationByIdSchema } from '../utils/location-zod-schemas';
import { getLocationsSchemaForQuery } from '../utils/location-zod-schemas';

import { locationController } from '@src/location/infrastructure/repositories/dependecies';
import { validateRequest } from '@shared/zod-validator';

const routes = Router();

routes
  /**
   * @swagger
   *  /parking/location:
   *    post:
   *      summary: Create a new location with slots
   *      description: Create a new location with slots
   *      tags: [Locations]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Location'
   *      responses:
   *        201:
   *          description: Location created
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Location created
   *        400:
   *          description: Bad request or validation error
   *        500:
   *          description: Internal server error

   */
  .post(
    '/location',
    validateRequest(locationCreateSchema, 'body'),
    locationController.createLocation.bind(locationController)
  )
  /**
   * @swagger
   *  /parking/location:
   *    get:
   *      summary: Get all locations
   *      description: Get all locations
   *      tags: [Locations]
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            type: number
   *          required: true
   *          description: Page number
   *        - in: query
   *          name: limit
   *          schema:
   *            type: number
   *          required: true
   *          description: Number of items per page
   *      responses:
   *        200:
   *          description: Get locations
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/LocationResponse'
   */
  .get(
    '/location',
    validateRequest(getLocationsSchemaForQuery, 'query'),
    locationController.locationFinder.bind(locationController)
  )
  /**
   * @swagger
   *  /parking/location/{id}:
   *    get:
   *      summary: Get location by id
   *      description: Get location by id
   *      tags: [Locations]
   *      parameters:
   *        - in: path
   *          name: id
   *          description: Location id
   *          required: true
   *          schema:
   *            type: string
   *            format: uuid
   *      responses:
   *        200:
   *          description: Get location
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/LocationResponse-location-by-id'
   *        400:
   *          description: Invalid uuid or format error
   *        404:
   *          description: Location not found
   *          content:
   *            application/json:
   *              schema:
   *                  type: object
   *                  properties:
   *                    message:
   *                      type: string
   *                      example: Location not found
   *        500:
   *          description: Internal server error
   */
  .get(
    '/location/:id',
    validateRequest(getLocationByIdSchema, 'params'),
    locationController.locationFinderById.bind(locationController)
  )
  /**
   * @swagger
   *  /parking/location/{id}:
   *    put:
   *      summary: Update location
   *      description: Update location
   *      tags: [Locations]
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          description: Location id
   *          schema:
   *            type: string
   *            format: uuid
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Location-to-update'
   *      responses:
   *        200:
   *          description: Location updated
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Location updated
   *        400:
   *          description: Bad request or validation error
   *        404:
   *          description: Location not found
   *          content:
   *            application/json:
   *              schema:
   *                  type: object
   *                  properties:
   *                    message:
   *                      type: string
   *
   */
  .put(
    '/location/:id',
    validateRequest(locationUpdateParamsSchema, 'params'),
    validateRequest(locationUpdateSchema, 'body'),
    locationController.updateLocation.bind(locationController)
  )
  /**
   * @swagger
   *  /parking/location/{id}:
   *    delete:
   *      summary: Delete location
   *      description: Delete location
   *      tags: [Locations]
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          description: Location id
   *          schema:
   *            type: string
   *            format: uuid
   *      responses:
   *        200:
   *          description: Location deleted
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Location deleted
   *        400:
   *          description: Invalid uuid or format error
   *        404:
   *          description: Location not found
   *          content:
   *            application/json:
   *              schema:
   *                  type: object
   *                  properties:
   *                    message:
   *                      type: string
   *                      example: Location not found
   *        500:
   *          description: Internal server error
   */
  .delete(
    '/location/:id',
    validateRequest(locationDeleteParamsSchema, 'params'),
    locationController.deleteLocation.bind(locationController)
  );

/**
 * @swagger
 * components:
 *  schemas:
 *    Slot:
 *      type: object
 *      properties:
 *        slot_number:
 *          type: string
 *          description: The slot number
 *          example: A1
 *        slot_type:
 *          type: string
 *          description: The type of slot
 *          enum:
 *            - SIMPLE
 *            - MULTIPLE
 *          example: SIMPLE
 *        limit_schedules:
 *          type: number
 *          description: Limit schedule must be number and should be greater than 1 and less than 24
 *          minimum: 1
 *          maximum: 24
 *          example: 8
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
 *          example: SIN_COSTO
 *        cost:
 *          type: number
 *          description: The cost
 *          example: 20
 *        status:
 *          type: string
 *          description: The status of the slot
 *          enum:
 *            - DISPONIBLE
 *            - INACTIVO
 *          example: DISPONIBLE
 *    Location:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Parqueo Zona 1 Centro Capitol
 *        address:
 *          type: string
 *          description: Address of the location
 *          example: 1st Avenue, Zone 1, Capitol
 *        contact_reference:
 *          type: string
 *          description: Contact reference for the location
 *          example: John Doe
 *        phone:
 *          type: string
 *          description: Phone number in the format +(5XX) XXXXXXXX
 *          example: +(502) 45454545
 *          pattern: '^\\+\\(50\\d{1}\\) \\d{8}$'
 *        email:
 *          type: string
 *          description: Email address
 *          format: email
 *          example: example@mail.com
 *        comments:
 *          type: string
 *          description: Additional comments
 *          example: This is a test location
 *        status:
 *          type: string
 *          description: Status of the location
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        slots:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Slot'
 *          description: Array of parking slots
 *          example:
 *            - slot_number: A1
 *              slot_type: SIMPLE
 *              limit_schedules: 8
 *              vehicle_type: CARRO
 *              cost_type: SIN_COSTO
 *              cost: 20
 *              status: DISPONIBLE
 *
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    LocationHeder:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the location
 *          example: 3a80202a-2db6-4d60-a207-9c711120f358
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Weissnat - Witting
 *        address:
 *          type: string
 *          description: Address of the location
 *          example: 3122 Satterfield Locks
 *        contact_reference:
 *          type: string
 *          description: Contact reference for the location
 *          example: Angelina Kovacek
 *        phone:
 *          type: string
 *          description: Phone number in the format +(5XX) XXXXXXXX
 *          example: +(502) 45573001
 *          pattern: '^\\+\\(50\\d{1}\\) \\d{8}$'
 *        email:
 *          type: string
 *          description: Email address
 *          format: email
 *          example: Tracy.Wehner@hotmail.com
 *        comments:
 *          type: string
 *          description: Additional comments
 *          example: cross-platform
 *        status:
 *          type: string
 *          description: Status of the location
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        created_at:
 *          type: string
 *          description: Creation date of the location
 *          format: date-time
 *          example: 2024-07-22T23:11:14.823Z
 *    LocationResponse:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/LocationHeder'
 *          description: Array of locations
 *        pageCounter:
 *          type: integer
 *          description: The current page number
 *          example: 1
 */

// location by id
/**
 * @swagger
 * components:
 *  schemas:
 *    Slot-location-by-id:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the slot
 *          example: 442d0987-852b-499b-92ae-ea3a6a5caf51
 *        location_id:
 *          type: string
 *          description: Identifier of the location this slot belongs to
 *          example: 3a80202a-2db6-4d60-a207-9c711120f358
 *        slot_number:
 *          type: string
 *          description: The slot number
 *          example: STIOCDW1PIF
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
 *          example: 100
 *        status:
 *          type: string
 *          description: The status of the slot
 *          enum:
 *            - DISPONIBLE
 *            - INACTIVO
 *          example: DISPONIBLE
 *    Location-location-by-id:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the location
 *          example: 3a80202a-2db6-4d60-a207-9c711120f358
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Weissnat - Witting
 *        address:
 *          type: string
 *          description: Address of the location
 *          example: 3122 Satterfield Locks
 *        contact_reference:
 *          type: string
 *          description: Contact reference for the location
 *          example: Angelina Kovacek
 *        phone:
 *          type: string
 *          description: Phone number in the format +(5XX) XXXXXXXX
 *          example: +(502) 45573001
 *          pattern: '^\\+\\(50\\d{1}\\) \\d{8}$'
 *        email:
 *          type: string
 *          description: Email address
 *          format: email
 *          example: Tracy.Wehner@hotmail.com
 *        comments:
 *          type: string
 *          description: Additional comments
 *          example: cross-platform
 *        status:
 *          type: string
 *          description: Status of the location
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        slots:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Slot-location-by-id'
 *          description: Array of parking slots
 *          example:
 *            - id: 442d0987-852b-499b-92ae-ea3a6a5caf51
 *              location_id: 3a80202a-2db6-4d60-a207-9c711120f358
 *              slot_number: STIOCDW1PIF
 *              slot_type: MULTIPLE
 *              limit_schedules: 5
 *              vehicle_type: CARRO
 *              cost_type: DESCUENTO
 *              cost: 100
 *              status: DISPONIBLE
 *    LocationResponse-location-by-id:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/Location-location-by-id'
 */

//Update
/**
 * @swagger
 * components:
 *  schemas:
 *    Slot-to-update:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Unique identifier for the slot (Optional)
 *          example: 895110f9-75d0-4444-a9e5-46cf7d0d25ed
 *        slot_number:
 *          type: string
 *          description: The slot number
 *          example: abc-abc-abc
 *        slot_type:
 *          type: string
 *          description: The type of slot
 *          enum:
 *            - SIMPLE
 *            - MULTIPLE
 *          example: SIMPLE
 *        limit_schedules:
 *          type: number
 *          description: Limit schedule must be a number and should be greater than 0 and less than 24
 *          minimum: 0
 *          maximum: 24
 *          example: 10
 *        status:
 *          type: string
 *          description: The status of the slot
 *          enum:
 *            - DISPONIBLE
 *            - INACTIVO
 *          example: DISPONIBLE
 *        cost_type:
 *          type: string
 *          description: The cost type
 *          enum:
 *            - SIN_COSTO
 *            - DESCUENTO
 *            - COMPLEMENTO
 *          example: DESCUENTO
 *        vehicle_type:
 *          type: string
 *          description: The type of vehicle
 *          enum:
 *            - CARRO
 *            - MOTO
 *            - CAMION
 *          example: MOTO
 *        cost:
 *          type: number
 *          description: The cost
 *          example: 100.50
 *    Location-to-update:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the location
 *          example: Parqueo Zona 1 Centro Capitol
 *        address:
 *          type: string
 *          description: Address of the location
 *          example: 1st Avenue, Zone 1, Capitol
 *        contact_reference:
 *          type: string
 *          description: Contact reference for the location
 *          example: John Doe
 *        phone:
 *          type: string
 *          description: Phone number in the format +(5XX) XXXXXXXX
 *          example: +(502) 45454545
 *          pattern: '^\\+\\(50\\d{1}\\) \\d{8}$'
 *        email:
 *          type: string
 *          description: Email address
 *          format: email
 *          example: example@mail.com
 *        comments:
 *          type: string
 *          description: Additional comments
 *          example: This is a test location
 *        status:
 *          type: string
 *          description: Status of the location
 *          enum:
 *            - ACTIVO
 *            - INACTIVO
 *          example: ACTIVO
 *        slots:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Slot-to-update'
 *          description: Array of parking slots
 *          example:
 *            - id: 895110f9-75d0-4444-a9e5-46cf7d0d25ed
 *              slot_number: abc-abc-abc
 *              slot_type: SIMPLE
 *              limit_schedules: 10
 *              status: DISPONIBLE
 *              cost_type: DESCUENTO
 *              vehicle_type: MOTO
 *              cost: 100.50
 *        slots_to_delete:
 *          type: array
 *          items:
 *            type: string
 *            description: Unique identifier for the slot to delete
 *          description: Array of slot IDs to delete (optional)
 *          example:
 *            - 9507106f-0049-4c8b-84eb-207e8914b3fd
 *            - 7fec05e7-1d37-4fbe-96b1-94a235464211
 */

export default routes;
