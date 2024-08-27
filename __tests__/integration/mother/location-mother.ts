import { faker } from "@faker-js/faker";

export class LocationMother{
  static createLocationRequest(
    name: string = faker.company.name(),
    address: string = faker.location.streetAddress(),
    contactReference: string = faker.person.fullName(),
    phone: string = '+(502) 45573001',
    email: string = faker.internet.email(),
    comments: string = faker.lorem.sentence(),
    numberOfIdentifier: string = faker.finance.iban(),
    status: string = 'ACTIVO',
  ){
    return {
        name,
        address,
        contactReference,
        phone,
        email,
        comments,
        numberOfIdentifier,
        status,
        slots: [
          {
            slotNumber: faker.finance.iban(),
            slotType: 'SIMPLE',
            limitOfAssignments: 1,
            status: 'DISPONIBLE',
            costType: 'SIN_COSTO',
            vehicleType: 'CARRO',
            cost: 0
          },
          {
            slotNumber: faker.finance.iban(),
            slotType: 'MULTIPLE',
            limitOfAssignments: 5,
            status: 'DISPONIBLE',
            costType: 'DESCUENTO',
            vehicleType: 'CARRO',
            cost: 100
          },
          {
            slotNumber: faker.finance.iban(),
            slotType: 'SIMPLE',
            limitOfAssignments: 1,
            status: 'DISPONIBLE',
            costType: 'COMPLEMENTO',
            vehicleType: 'CARRO',
            cost: 100
          }
        ]
      }
  }

}
