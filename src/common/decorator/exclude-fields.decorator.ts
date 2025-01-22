import { SetMetadata } from "@nestjs/common";
export const EXCULDE_FIELDS_KEY = "exculde_fields_key";

export const ExculdeFields = (...fields: string[]) =>
  SetMetadata(EXCULDE_FIELDS_KEY, fields);
