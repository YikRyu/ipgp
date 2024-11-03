export class User{
  id: string;
  email: string;
  type: string;
  name: string;
  position: string;
  department: string;
  points: number;
  contact: string;
  address: string;
  active: boolean;
}

export class UserUpdateDto {
  type: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  address: string;
}

export class UserEntryDto{
  id: string;
  email: string;
  password: string;
  type: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  address: string;
}