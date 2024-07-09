export class EmployeeEntity {
  constructor(
    private id: string,
    private code_employee: string,
    private name: string,
    private workplace: string,
    private identifier_document: string,
    private company: string,
    private department: string,
    private sub_management: string,
    private management_1: string,
    private management_2: string,
    private work_site: string,
    private address: string,
    private email: string,
    private phone: string,
    private access_token: string,
    private access_token_status: string
  ) {}
}
