export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export type FieldDefinition = {
  name: string;
  type?: string;
  description?: string;
  required?: boolean;
};
