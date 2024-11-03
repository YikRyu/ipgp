import { Recognition } from "./recognition.mode";
import { User } from "./user.model";

export class PointsTransaction{
  id: number;
  recognitionId: Recognition;
  userId: User;
  createdDate: Date;
}