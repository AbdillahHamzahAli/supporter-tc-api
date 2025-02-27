export class Validation {
  static validate<T>(schema: any, data: T): T {
    return schema.parse(data);
  }
}
