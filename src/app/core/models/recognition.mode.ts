import { User } from "./user.model";

export class Recognition{
  id: number;
  type: string;
  title: string;
  description: string;
  points: number;
  status: string;
  referee: User;
  refereeApproval: boolean | null;
  admin: User;
  adminApproval: boolean | null;
  peer: User;
  createdBy: User;
  createdDate: Date;
  modifiedBy: User;
  modifiedDate: Date;
}

export class RecognitionEntryDto{
  type: string;
  title: string;
  description: string;
  points: number;
  status: string;
  referee: string;
  peer: string;
  createdBy: string;
}

export class RecognitionUpdateDto{
  points: number;
  status: string;
  refereeApproval: boolean | null;
  admin: string;
  adminApproval: boolean | null;
  modifiedBy: string;
}