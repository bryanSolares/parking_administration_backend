export class TemplateVariableEntity {
  constructor(
    readonly id: string,
    readonly variableName: string,
    readonly variableDescription: string,
    readonly exampleValue: string,
    readonly entity: string,
    readonly columnName: string
  ) {}

  static fromPrimitive(data: {
    id: string;
    variableName: string;
    variableDescription: string;
    exampleValue: string;
    entity: string;
    columnName: string;
  }): TemplateVariableEntity {
    return new TemplateVariableEntity(
      data.id,
      data.variableName,
      data.variableDescription,
      data.exampleValue,
      data.entity,
      data.columnName
    );
  }

  toPrimitive() {
    return {
      id: this.id,
      variableName: this.variableName,
      variableDescription: this.variableDescription,
      exampleValue: this.exampleValue,
      entity: this.entity,
      columnName: this.columnName
    };
  }
}
