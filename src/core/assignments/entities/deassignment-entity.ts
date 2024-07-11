export class DeAssignmentEntity {
  constructor(
    private readonly id: string,
    private readonly assignment_id: string,
    private readonly reason: string,
    private readonly de_assignment_date: Date,
    private readonly is_rpa_action: boolean
  ) {}
}
