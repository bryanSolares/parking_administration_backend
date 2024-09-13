import { faker } from "@faker-js/faker";
import { VehicleEntity } from "../../../src/assignment/core/entities/vehicle-entity";
import { VehicleType } from "../../../src/location/core/entities/slot-entity";
import { VehicleModel } from "../../../src/server/config/database/models/vehicle.model";

export class VehicleBuilder {
  private _vehicleEntity: VehicleEntity;

  constructor() {
    this._vehicleEntity = this.createVehicleEntity({});
  }

  private createVehicleEntity({
    id = faker.string.uuid(),
    vehicleBadge = faker.commerce.productName(),
    brand = faker.commerce.productName(),
    model = faker.commerce.productName(),
    type = VehicleType.CAR,
    color = faker.commerce.productMaterial()
  }: {
    id?: string;
    vehicleBadge?: string;
    brand?: string;
    model?: string;
    type?: VehicleType;
    color?: string;
  }): VehicleEntity {
    return new VehicleEntity(id, vehicleBadge, color, brand, model, type);
  }

  public async build(employeeId: string): Promise<VehicleEntity> {
    await VehicleModel.create({...this._vehicleEntity.toPrimitive(), employeeId});
    return this._vehicleEntity;
  }

  public get vehicleEntity(): VehicleEntity {
    return this._vehicleEntity;
  }
}
