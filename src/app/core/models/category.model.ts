import { User } from "./user.model";

export class Category {
  id: number;
  name: string;
  createdBy: User;
  createdDate: Date;
  modifiedBy: User;
  modifiedDate: Date;
}

export class CategoryEntryDto {
  name: string;
  createdBy: string | null;
  modifiedBy: string | null;
}