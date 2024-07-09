export class VehicleEntity {
  constructor(
    public id: string,
    public employee_id: string,
    public vehicle_badge: string,
    public color: string,
    public brand: string,
    public model: string,
    public type: string
  ) {}
}
