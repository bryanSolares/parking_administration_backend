export class VehicleEntity {
  constructor(
    public readonly id: string,
    public readonly employee_id: string,
    public readonly vehicle_badge: string,
    public readonly color: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly type: string
  ) {}
}
